import { fail, redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { logIn } from '#lib/server/auth.ts';
import { textField } from '#lib/server/forms.ts';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = textField(data, 'email');

		if (!(await logIn(cookies, email, textField(data, 'password')))) {
			return fail(400, { email, message: 'E-mail ou senha incorretos.' });
		}

		redirect(303, resolve('/admin'));
	}
};
