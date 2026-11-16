import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import type { PageServerLoad } from './$types';

// Por enquanto o painel abre direto nos pedidos.
export const load: PageServerLoad = () => {
	redirect(303, resolve('/admin/pedidos'));
};
