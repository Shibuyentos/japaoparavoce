import { randomInt } from 'node:crypto';
import { and, asc, count, desc, eq, gte, inArray, sql, type SQL } from 'drizzle-orm';
import type {
	AdminOrderDetails,
	CartLine,
	CartQuote,
	OrderDetails,
	OrderLine,
	OrderListItem,
	OrderStatus,
	ShippingRegion
} from '#lib/types.ts';
import type { Cart } from './cart';
import { getStoreSettings } from './catalog';
import { db } from './db';
import { ORDER_STATUSES, orderItems, orders, products, shippingRegions, users } from './db/schema';
import { calculateOrderTotals, jpyToBrlCents, orderTotalJpy, orderWeightGrams } from './pricing';
import { findShippingPriceJpy } from './shipping';

async function loadCartLines(cart: Cart): Promise<CartLine[]> {
	if (cart.items.size === 0) return [];

	const rows = await db
		.select({
			productId: products.id,
			slug: products.slug,
			name: products.name,
			image: products.image,
			priceType: products.priceType,
			unitPriceJpy: products.priceJpy,
			weightGrams: products.weightGrams
		})
		.from(products)
		.where(and(inArray(products.slug, [...cart.items.keys()]), eq(products.isActive, true)));
	const rowsBySlug = new Map(rows.map((row) => [row.slug, row]));

	// Segue a ordem do carrinho. Produtos que saíram da vitrine ficam de fora.
	const lines: CartLine[] = [];
	for (const [slug, quantity] of cart.items) {
		const row = rowsBySlug.get(slug);
		if (row) lines.push({ ...row, quantity });
	}
	return lines;
}

// Preços, peso e frete são sempre calculados aqui, a partir do banco: do navegador
// só vêm os slugs, as quantidades e a região.
export async function quoteCart(cart: Cart, regions: ShippingRegion[]): Promise<CartQuote> {
	const region = regions.find((candidate) => candidate.code === cart.regionCode) ?? regions[0];
	const [settings, lines] = await Promise.all([getStoreSettings(), loadCartLines(cart)]);

	const charges = {
		domesticShippingJpy: settings.domesticShippingJpy,
		serviceFeeJpy: settings.serviceFeeJpy,
		internationalShippingJpy: await findShippingPriceJpy(region.id, orderWeightGrams(lines)),
		brlCentsPerHundredJpy: settings.brlCentsPerHundredJpy
	};

	return { region, lines, charges, totals: calculateOrderTotals(lines, charges) };
}

export type OrderCustomer = {
	name: string;
	instagramHandle: string;
	note: string | null;
};

export type OrderCustomerErrors = Partial<Record<'name' | 'instagram' | 'note', string>>;

type OrderCustomerValidation =
	{ ok: true; customer: OrderCustomer } | { ok: false; errors: OrderCustomerErrors };

const INSTAGRAM_HANDLE_PATTERN = /^[a-z0-9._]{1,30}$/;

export function validateOrderCustomer(input: {
	name: string;
	instagram: string;
	note: string;
}): OrderCustomerValidation {
	const name = input.name.trim();
	const instagramHandle = input.instagram.trim().replace(/^@/, '').toLowerCase();
	const note = input.note.trim();

	const errors: OrderCustomerErrors = {};
	if (name.length < 2 || name.length > 80) errors.name = 'Informe seu nome (até 80 caracteres).';
	if (!INSTAGRAM_HANDLE_PATTERN.test(instagramHandle)) {
		errors.instagram = 'Informe seu usuário do Instagram, como @seunome.';
	}
	if (note.length > 500) errors.note = 'A observação pode ter até 500 caracteres.';

	if (Object.keys(errors).length > 0) return { ok: false, errors };
	return { ok: true, customer: { name, instagramHandle, note: note || null } };
}

// Sem 0, O, 1 e I, que se confundem quando o código é lido ou digitado.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 8;

function generateOrderCode(): string {
	let code = '';
	for (let index = 0; index < CODE_LENGTH; index++) {
		code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
	}
	return code;
}

export async function createOrder(
	quote: CartQuote,
	customer: OrderCustomer,
	userId: number
): Promise<string> {
	const code = generateOrderCode();

	await db.transaction(async (tx) => {
		const [order] = await tx
			.insert(orders)
			.values({
				code,
				userId,
				customerName: customer.name,
				instagramHandle: customer.instagramHandle,
				note: customer.note,
				shippingRegionId: quote.region.id,
				...quote.charges
			})
			.returning({ id: orders.id });

		await tx.insert(orderItems).values(
			quote.lines.map((line) => ({
				orderId: order.id,
				productId: line.productId,
				productName: line.name,
				unitPriceJpy: line.unitPriceJpy,
				priceType: line.priceType,
				weightGrams: line.weightGrams,
				quantity: line.quantity
			}))
		);
	});

	return code;
}

const orderCharges = {
	domesticShippingJpy: orders.domesticShippingJpy,
	serviceFeeJpy: orders.serviceFeeJpy,
	internationalShippingJpy: orders.internationalShippingJpy,
	brlCentsPerHundredJpy: orders.brlCentsPerHundredJpy
};

const orderDetailColumns = {
	code: orders.code,
	status: orders.status,
	createdAt: orders.createdAt,
	regionName: shippingRegions.name,
	charges: orderCharges
};

function loadOrderLines(code: string): Promise<OrderLine[]> {
	return db
		.select({
			name: orderItems.productName,
			priceType: orderItems.priceType,
			unitPriceJpy: orderItems.unitPriceJpy,
			weightGrams: orderItems.weightGrams,
			quantity: orderItems.quantity
		})
		.from(orderItems)
		.innerJoin(orders, eq(orders.id, orderItems.orderId))
		.where(eq(orders.code, code))
		.orderBy(asc(orderItems.id));
}

// Pedido completo, com os dados de contato: só o painel pode usar.
export async function findAdminOrderByCode(code: string): Promise<AdminOrderDetails | undefined> {
	const [order] = await db
		.select({
			...orderDetailColumns,
			customerName: orders.customerName,
			instagramHandle: orders.instagramHandle,
			note: orders.note,
			accountEmail: users.email
		})
		.from(orders)
		.innerJoin(shippingRegions, eq(shippingRegions.id, orders.shippingRegionId))
		.leftJoin(users, eq(users.id, orders.userId))
		.where(eq(orders.code, code));
	if (!order) return undefined;

	const lines = await loadOrderLines(code);
	return { ...order, lines, totals: calculateOrderTotals(lines, order.charges) };
}

// Pedido para a área "Minha conta": só é encontrado se pertencer a essa conta.
export async function findCustomerOrder(
	userId: number,
	code: string
): Promise<OrderDetails | undefined> {
	const [order] = await db
		.select(orderDetailColumns)
		.from(orders)
		.innerJoin(shippingRegions, eq(shippingRegions.id, orders.shippingRegionId))
		.where(and(eq(orders.code, code), eq(orders.userId, userId)));
	if (!order) return undefined;

	const lines = await loadOrderLines(code);
	return { ...order, lines, totals: calculateOrderTotals(lines, order.charges) };
}

export function parseOrderStatus(value: string): OrderStatus | undefined {
	return ORDER_STATUSES.find((status) => status === value);
}

export type OrderListFilters = {
	status?: OrderStatus;
	// Só os pedidos dessa conta.
	userId?: number;
	// Só os pedidos feitos a partir desse instante.
	since?: Date;
	limit?: number;
};

// Mais recentes primeiro.
export async function listOrders({ status, userId, since, limit }: OrderListFilters = {}): Promise<
	OrderListItem[]
> {
	const conditions: SQL[] = [];
	if (status) conditions.push(eq(orders.status, status));
	if (userId !== undefined) conditions.push(eq(orders.userId, userId));
	if (since) conditions.push(gte(orders.createdAt, since));

	const query = db
		.select({
			code: orders.code,
			status: orders.status,
			customerName: orders.customerName,
			instagramHandle: orders.instagramHandle,
			createdAt: orders.createdAt,
			regionName: shippingRegions.name,
			charges: orderCharges,
			itemCount: sql`sum(${orderItems.quantity})`.mapWith(Number),
			productsJpy: sql`sum(${orderItems.unitPriceJpy} * ${orderItems.quantity})`.mapWith(Number)
		})
		.from(orders)
		.innerJoin(shippingRegions, eq(shippingRegions.id, orders.shippingRegionId))
		.innerJoin(orderItems, eq(orderItems.orderId, orders.id))
		.where(and(...conditions))
		.groupBy(orders.id, shippingRegions.id)
		.orderBy(desc(orders.createdAt), desc(orders.id));
	const rows = await (limit === undefined ? query : query.limit(limit));

	return rows.map(({ charges, productsJpy, ...order }) => {
		const totalJpy = orderTotalJpy(productsJpy, charges);
		return {
			...order,
			totalJpy,
			totalBrlCents: jpyToBrlCents(totalJpy, charges.brlCentsPerHundredJpy),
			serviceFeeJpy: charges.serviceFeeJpy
		};
	});
}

export async function countOrdersByStatus(): Promise<Partial<Record<OrderStatus, number>>> {
	const rows = await db
		.select({ status: orders.status, total: count() })
		.from(orders)
		.groupBy(orders.status);

	return Object.fromEntries(rows.map((row) => [row.status, row.total]));
}

// Devolve false quando não existe pedido com esse código.
export async function updateOrderStatus(code: string, status: OrderStatus): Promise<boolean> {
	const updated = await db
		.update(orders)
		.set({ status })
		.where(eq(orders.code, code))
		.returning({ id: orders.id });

	return updated.length > 0;
}
