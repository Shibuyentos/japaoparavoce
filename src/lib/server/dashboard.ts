import { and, asc, desc, eq, gte, ne, sql } from 'drizzle-orm';
import type {
	AdminOrderSummary,
	DailyOrderCount,
	OrderStatus,
	PeriodSummary,
	TopProduct
} from '#lib/types.ts';
import { db } from './db';
import { orderItems, orders, products } from './db/schema';
import { countOrdersByStatus, listAdminOrders } from './orders';
import { lastStoreDays, storeDateKey, storeDayStart } from './store-days';

const PERIOD_DAYS = 30;
const TOP_PRODUCT_COUNT = 5;
const RECENT_ORDER_COUNT = 5;

// Um pedido enviado também já foi pago.
const PAID_STATUSES: OrderStatus[] = ['paid', 'shipped'];

function sumBy<T>(items: T[], value: (item: T) => number): number {
	return items.reduce((total, item) => total + value(item), 0);
}

function summarizePeriod(periodOrders: AdminOrderSummary[]): PeriodSummary {
	const paidOrders = periodOrders.filter((order) => PAID_STATUSES.includes(order.status));

	return {
		orderCount: periodOrders.length,
		paidCount: paidOrders.length,
		paidJpy: sumBy(paidOrders, (order) => order.totalJpy),
		paidBrlCents: sumBy(paidOrders, (order) => order.totalBrlCents),
		serviceFeesJpy: sumBy(paidOrders, (order) => order.serviceFeeJpy)
	};
}

function countOrdersByDay(periodOrders: AdminOrderSummary[], days: string[]): DailyOrderCount[] {
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

	const [statusCounts, loadedOrders, recentOrders, topProducts] = await Promise.all([
		countOrdersByStatus(),
		listAdminOrders({ since: storeDayStart(days[0]) }),
		listAdminOrders({ limit: RECENT_ORDER_COUNT }),
		listTopProducts(currentStart)
	]);

	const isCurrent = (order: AdminOrderSummary) =>
		order.createdAt.getTime() >= currentStart.getTime();
	const currentOrders = loadedOrders.filter(isCurrent);
	const previousOrders = loadedOrders.filter((order) => !isCurrent(order));

	return {
		periodDays: PERIOD_DAYS,
		statusCounts,
		current: summarizePeriod(currentOrders),
		previous: summarizePeriod(previousOrders),
		ordersByDay: countOrdersByDay(currentOrders, currentDays),
		topProducts,
		recentOrders
	};
}
