import { countOrdersByStatus, listOrders, parseOrderStatus } from '#lib/server/orders.ts';
import type { PageServerLoad } from './$types';

const MAX_SEARCH_LENGTH = 80;

export const load: PageServerLoad = async ({ url }) => {
	// Status desconhecido na URL mostra todos os pedidos.
	const activeStatus = parseOrderStatus(url.searchParams.get('status') ?? '') ?? null;
	const search = (url.searchParams.get('busca') ?? '').trim().slice(0, MAX_SEARCH_LENGTH);

	const [orders, counts] = await Promise.all([
		listOrders({ status: activeStatus ?? undefined, search }),
		countOrdersByStatus()
	]);

	return { orders, counts, activeStatus, search };
};
