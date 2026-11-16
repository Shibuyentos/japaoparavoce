import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { logOut } from '#lib/server/auth.ts';
import type { Actions, PageServerLoad } from './$types';

// Sair é sempre um POST (o botão do painel). Abrir o endereço direto só volta para o painel.
export const load: PageServerLoad = () => {
	redirect(303, resolve('/admin'));
};

export const actions: Actions = {
	default: async ({ cookies }) => {
		await logOut(cookies);
		redirect(303, resolve('/admin/login'));
	}
};
