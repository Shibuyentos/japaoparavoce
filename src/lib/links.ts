import { resolve } from '$app/paths';

// Os filtros ficam na URL para a busca poder ser compartilhada e funcionar sem JavaScript.
export function vitrineHref(categorySlug: string | null, search = '') {
	const params = new URLSearchParams();
	if (categorySlug) params.set('categoria', categorySlug);
	if (search.trim()) params.set('busca', search);

	const query = params.toString();
	return query ? resolve(`/vitrine?${query}`) : resolve('/vitrine');
}

export function productHref(slug: string) {
	return resolve('/vitrine/[slug]', { slug });
}

// Lista de pedidos do painel: o filtro de status e a busca também ficam na URL.
export function adminOrdersHref(status: string | null, search = '') {
	const params = new URLSearchParams();
	if (status) params.set('status', status);
	if (search) params.set('busca', search);

	const query = params.toString();
	return query ? resolve(`/admin/pedidos?${query}`) : resolve('/admin/pedidos');
}
