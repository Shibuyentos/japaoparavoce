import { error } from '@sveltejs/kit';
import { requireUser } from '#lib/server/auth.ts';
import { findCustomerOrder } from '#lib/server/orders.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const user = requireUser(event);

	// Pedido de outra conta responde igual a pedido que não existe.
	const order = await findCustomerOrder(user.id, event.params.code.toUpperCase());
	if (!order) error(404, 'Pedido não encontrado');

	return { order };
};
