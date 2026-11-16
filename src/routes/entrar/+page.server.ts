import { fail, redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { authenticate, destinationAfterLogin, startSession } from '#lib/server/auth.ts';
import { textField } from '#lib/server/forms.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, url }) => {
	if (locals.user) redirect(303, destinationAfterLogin(url, resolve('/conta')));
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const email = textField(data, 'email');

		const user = await authenticate(email, textField(data, 'password'));
		if (!user) return fail(400, { email, message: 'E-mail ou senha incorretos.' });

		await startSession(cookies, user.id);
		redirect(303, destinationAfterLogin(url, resolve('/conta')));
	}
};
