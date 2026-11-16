import { fail, redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { authenticate, startSession } from '#lib/server/auth.ts';
import { textField } from '#lib/server/forms.ts';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = textField(data, 'email');

		// Conta de cliente não entra por aqui, e a mensagem é a mesma de uma senha errada.
		const user = await authenticate(email, textField(data, 'password'));
		if (user?.role !== 'admin') {
			return fail(400, { email, message: 'E-mail ou senha incorretos.' });
		}

		await startSession(cookies, user.id);
		redirect(303, resolve('/admin'));
	}
};
