import { fail, redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import {
	createCustomer,
	validateRegistration,
	type RegistrationErrors
} from '#lib/server/accounts.ts';
import { destinationAfterLogin, startSession } from '#lib/server/auth.ts';
import { textField } from '#lib/server/forms.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, url }) => {
	if (locals.user) redirect(303, destinationAfterLogin(url, resolve('/conta')));
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		// A senha não volta para o formulário quando há erro.
		const values = { name: textField(data, 'name'), email: textField(data, 'email') };

		const validation = validateRegistration({ ...values, password: textField(data, 'password') });
		if (!validation.ok) return fail(400, { values, errors: validation.errors });

		const userId = await createCustomer(validation.registration);
		if (userId === null) {
			const errors: RegistrationErrors = { email: 'Já existe uma conta com esse e-mail.' };
			return fail(400, { values, errors });
		}

		await startSession(cookies, userId);
		redirect(303, destinationAfterLogin(url, resolve('/conta')));
	}
};
