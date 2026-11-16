import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { endSession } from '#lib/server/auth.ts';
import type { Actions, PageServerLoad } from './$types';

// Sair é sempre um POST (o botão "Sair"). Abrir o endereço direto só leva para a loja.
export const load: PageServerLoad = () => {
	redirect(303, resolve('/'));
};

export const actions: Actions = {
	default: async ({ cookies }) => {
		await endSession(cookies);
		redirect(303, resolve('/'));
	}
};
