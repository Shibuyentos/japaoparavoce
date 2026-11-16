import { countOrdersByStatus, listAdminOrders, parseOrderStatus } from '#lib/server/orders.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// Status desconhecido na URL mostra todos os pedidos.
	const activeStatus = parseOrderStatus(url.searchParams.get('status') ?? '') ?? null;

	const [orders, counts] = await Promise.all([
		listAdminOrders(activeStatus ?? undefined),
		countOrdersByStatus()
	]);

	return { orders, counts, activeStatus };
};
