import { error } from '@sveltejs/kit';
import { findOrderByCode } from '#lib/server/orders.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const order = await findOrderByCode(params.code.toUpperCase());
	if (!order) error(404, 'Pedido não encontrado');

	return { order };
};
