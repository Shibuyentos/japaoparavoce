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

export function orderHref(code: string) {
	return resolve('/conta/pedidos/[code]', { code });
}

// O destino vai junto para a pessoa voltar aonde estava depois de entrar ou criar a conta.
export function loginHref(destination?: string) {
	return destination
		? resolve(`/entrar?destino=${encodeURIComponent(destination)}`)
		: resolve('/entrar');
}

export function registerHref(destination?: string) {
	return destination
		? resolve(`/cadastro?destino=${encodeURIComponent(destination)}`)
		: resolve('/cadastro');
}

// Rastreamento no site do correio do Japão, que posta a caixa pelo EMS.
export function trackingHref(trackingCode: string) {
	const params = new URLSearchParams({
		reqCodeNo1: trackingCode,
		searchKind: 'S002',
		locale: 'en'
	});
	return `https://trackings.post.japanpost.jp/services/srv/search/direct?${params}`;
}

// Lista de pedidos do painel: o filtro de status e a busca também ficam na URL.
export function adminOrdersHref(status: string | null, search = '') {
	const params = new URLSearchParams();
	if (status) params.set('status', status);
	if (search) params.set('busca', search);

	const query = params.toString();
	return query ? resolve(`/admin/pedidos?${query}`) : resolve('/admin/pedidos');
}
