import { and, asc, desc, eq, gte, inArray, ne, sql } from 'drizzle-orm';
import type {
	OrderListItem,
	DailyOrderCount,
	OrderStatus,
	PeriodSummary,
	QueueStatus,
	ShoppingItem,
	TopProduct
} from '#lib/types.ts';
import { db } from './db';
import { orderItems, orders, products } from './db/schema';
import { listOrders } from './orders';
import { lastStoreDays, storeDateKey, storeDayStart } from './store-days';

const PERIOD_DAYS = 30;
const TOP_PRODUCT_COUNT = 5;
const RECENT_ORDER_COUNT = 5;

// Um pedido enviado também já foi pago.
const PAID_STATUSES: OrderStatus[] = ['paid', 'shipped'];

// Os status em que o pedido espera uma ação da loja, na ordem do atendimento.
export const QUEUE_STATUSES = ['received', 'quoted', 'paid'] as const;
export type QueueStep = (typeof QUEUE_STATUSES)[number];

async function loadQueue(): Promise<Record<QueueStep, QueueStatus>> {
	const rows = await db
		.select({
			status: orders.status,
			received: orders.createdAt,
			quoted: orders.quotedAt,
			paid: orders.paidAt
		})
		.from(orders)
		.where(inArray(orders.status, [...QUEUE_STATUSES]));

	const queue: Record<QueueStep, QueueStatus> = {
		received: { count: 0, oldestSince: null },
		quoted: { count: 0, oldestSince: null },
		paid: { count: 0, oldestSince: null }
	};
	for (const row of rows) {
		const step = row.status as QueueStep;
		const since = row[step] ?? row.received;
		const entry = queue[step];
		entry.count += 1;
		if (!entry.oldestSince || since < entry.oldestSince) entry.oldestSince = since;
	}
	return queue;
}

// O que falta comprar na loja: os produtos dos pedidos pagos, somados.
async function listShoppingList(): Promise<ShoppingItem[]> {
	const quantity = sql`sum(${orderItems.quantity})`.mapWith(Number);
	const codes = sql<string>`group_concat(distinct ${orders.code})`;

	const rows = await db
		.select({ slug: products.slug, name: products.name, image: products.image, quantity, codes })
		.from(orderItems)
		.innerJoin(orders, eq(orders.id, orderItems.orderId))
		.innerJoin(products, eq(products.id, orderItems.productId))
		.where(eq(orders.status, 'paid'))
		.groupBy(products.id)
		.orderBy(asc(products.name));

	return rows.map(({ codes, ...item }) => ({ ...item, orderCodes: codes.split(',') }));
}

function sumBy<T>(items: T[], value: (item: T) => number): number {
	return items.reduce((total, item) => total + value(item), 0);
}

function summarizePeriod(periodOrders: OrderListItem[]): PeriodSummary {
	const paidOrders = periodOrders.filter((order) => PAID_STATUSES.includes(order.status));

	return {
		orderCount: periodOrders.length,
		paidCount: paidOrders.length,
		paidJpy: sumBy(paidOrders, (order) => order.totalJpy),
		paidBrlCents: sumBy(paidOrders, (order) => order.totalBrlCents),
		serviceFeesJpy: sumBy(paidOrders, (order) => order.serviceFeeJpy)
	};
}

function countOrdersByDay(periodOrders: OrderListItem[], days: string[]): DailyOrderCount[] {
	const counts = new Map<string, number>();
	for (const order of periodOrders) {
		const day = storeDateKey(order.createdAt);
		counts.set(day, (counts.get(day) ?? 0) + 1);
	}

	return days.map((date) => ({ date, count: counts.get(date) ?? 0 }));
}

// Soma as unidades de cada produto nos pedidos do período, sem contar os cancelados.
async function listTopProducts(since: Date): Promise<TopProduct[]> {
	const quantity = sql`sum(${orderItems.quantity})`.mapWith(Number);

	return db
		.select({ slug: products.slug, name: products.name, quantity })
		.from(orderItems)
		.innerJoin(orders, eq(orders.id, orderItems.orderId))
		.innerJoin(products, eq(products.id, orderItems.productId))
		.where(and(gte(orders.createdAt, since), ne(orders.status, 'cancelled')))
		.groupBy(products.id)
		.orderBy(desc(quantity), asc(products.name))
		.limit(TOP_PRODUCT_COUNT);
}

export async function getDashboard(now = new Date()) {
	// Dois períodos seguidos do mesmo tamanho: o atual e o anterior, que serve de comparação.
	const days = lastStoreDays(now, PERIOD_DAYS * 2);
	const currentDays = days.slice(PERIOD_DAYS);
	const currentStart = storeDayStart(currentDays[0]);

	const [queue, shoppingList, loadedOrders, recentOrders, topProducts] = await Promise.all([
		loadQueue(),
		listShoppingList(),
		listOrders({ since: storeDayStart(days[0]) }),
		listOrders({ limit: RECENT_ORDER_COUNT }),
		listTopProducts(currentStart)
	]);

	const isCurrent = (order: OrderListItem) => order.createdAt.getTime() >= currentStart.getTime();
	const currentOrders = loadedOrders.filter(isCurrent);
	const previousOrders = loadedOrders.filter((order) => !isCurrent(order));

	return {
		periodDays: PERIOD_DAYS,
		queue,
		shoppingList,
		current: summarizePeriod(currentOrders),
		previous: summarizePeriod(previousOrders),
		ordersByDay: countOrdersByDay(currentOrders, currentDays),
		topProducts,
		recentOrders
	};
}
