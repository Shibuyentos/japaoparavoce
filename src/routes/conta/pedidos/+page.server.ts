import { requireUser } from '#lib/server/auth.ts';
import { listOrders } from '#lib/server/orders.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const user = requireUser(event);

	return { orders: await listOrders({ userId: user.id }) };
};
