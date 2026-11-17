import { error, fail } from '@sveltejs/kit';
import { textField } from '#lib/server/forms.ts';
import {
	findAdminOrderByCode,
	parseOrderStatus,
	parseTrackingCode,
	saveTrackingCode,
	updateOrderStatus
} from '#lib/server/orders.ts';
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
	},

	// Guarda o código de rastreio e marca o pedido como enviado. Num pedido que já foi enviado,
	// só corrige o código.
	ship: async ({ request, params }) => {
		const input = textField(await request.formData(), 'trackingCode');
		const trackingCode = parseTrackingCode(input);
		if (!trackingCode) {
			return fail(400, {
				trackingCode: input,
				trackingError: 'Confira o código: são 2 letras, 9 números e 2 letras, como EJ123456789JP.'
			});
		}

		const code = params.code.toUpperCase();
		if (!(await saveTrackingCode(code, trackingCode))) error(404, 'Pedido não encontrado');
		await updateOrderStatus(code, 'shipped');

		return { saved: true };
	}
};
