import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { findOrderByCode, parseOrderCode } from '#lib/server/orders.ts';
import type { PageServerLoad } from './$types';

const MAX_CODE_LENGTH = 20;

// A busca é um GET (?codigo=...): funciona sem JavaScript e leva direto à página do pedido.
export const load: PageServerLoad = async ({ url }) => {
	const typed = (url.searchParams.get('codigo') ?? '').trim().slice(0, MAX_CODE_LENGTH);
	if (!typed) return { typed, notFound: false };

	const code = parseOrderCode(typed);
	if (code && (await findOrderByCode(code))) {
		redirect(303, resolve('/pedidos/[code]', { code }));
	}

	return { typed, notFound: true };
};
