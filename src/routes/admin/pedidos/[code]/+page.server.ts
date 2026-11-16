import { error, fail } from '@sveltejs/kit';
import { textField } from '#lib/server/forms.ts';
import { findAdminOrderByCode, parseOrderStatus, updateOrderStatus } from '#lib/server/orders.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const order = await findAdminOrderByCode(params.code.toUpperCase());
	if (!order) error(404, 'Pedido não encontrado');

	return { order };
};

export const actions: Actions = {
	status: async ({ request, params }) => {
		const status = parseOrderStatus(textField(await request.formData(), 'status'));
		if (!status) return fail(400, { message: 'Escolha um status da lista.' });

		const updated = await updateOrderStatus(params.code.toUpperCase(), status);
		if (!updated) error(404, 'Pedido não encontrado');

		return { saved: true };
	}
};
