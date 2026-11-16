import { randomInt } from 'node:crypto';
import { and, asc, eq, inArray } from 'drizzle-orm';
import type { CartLine, CartQuote, OrderDetails, ShippingRegion } from '#lib/types.ts';
import type { Cart } from './cart';
import { getStoreSettings } from './catalog';
import { db } from './db';
import { orderItems, orders, products, shippingRegions } from './db/schema';
import { calculateOrderTotals, orderWeightGrams } from './pricing';
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

export async function createOrder(quote: CartQuote, customer: OrderCustomer): Promise<string> {
	const code = generateOrderCode();

	await db.transaction(async (tx) => {
		const [order] = await tx
			.insert(orders)
			.values({
				code,
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

export async function findOrderByCode(code: string): Promise<OrderDetails | undefined> {
	const [order] = await db
		.select({
			id: orders.id,
			code: orders.code,
			regionName: shippingRegions.name,
			charges: {
				domesticShippingJpy: orders.domesticShippingJpy,
				serviceFeeJpy: orders.serviceFeeJpy,
				internationalShippingJpy: orders.internationalShippingJpy,
				brlCentsPerHundredJpy: orders.brlCentsPerHundredJpy
			}
		})
		.from(orders)
		.innerJoin(shippingRegions, eq(shippingRegions.id, orders.shippingRegionId))
		.where(eq(orders.code, code));
	if (!order) return undefined;

	const lines = await db
		.select({
			name: orderItems.productName,
			priceType: orderItems.priceType,
			unitPriceJpy: orderItems.unitPriceJpy,
			weightGrams: orderItems.weightGrams,
			quantity: orderItems.quantity
		})
		.from(orderItems)
		.where(eq(orderItems.orderId, order.id))
		.orderBy(asc(orderItems.id));

	return {
		code: order.code,
		regionName: order.regionName,
		lines,
		charges: order.charges,
		totals: calculateOrderTotals(lines, order.charges)
	};
}
