import { error } from '@sveltejs/kit';
import { readCart } from '#lib/server/cart.ts';
import { findProductBySlug, listProducts } from '#lib/server/catalog.ts';
import { quoteCart } from '#lib/server/orders.ts';
import { listShippingRegions } from '#lib/server/shipping.ts';
import type { PageServerLoad } from './$types';

const RELATED_COUNT = 5;

export const load: PageServerLoad = async ({ params, cookies }) => {
	const product = await findProductBySlug(params.slug);
	if (!product) error(404, 'Produto não encontrado');

	const [sameCategory, regions] = await Promise.all([
		listProducts({ categorySlug: product.categorySlug }),
		listShippingRegions()
	]);

	// Os vizinhos do produto na ordem alfabética da categoria, dando a volta no fim da lista:
	// assim cada página sugere produtos diferentes.
	const position = sameCategory.findIndex((candidate) => candidate.slug === product.slug);
	const related = [...sameCategory.slice(position + 1), ...sameCategory.slice(0, position)].slice(
		0,
		RELATED_COUNT
	);

	// Quanto sairia um pedido só com este produto, para a região escolhida no carrinho. É a mesma
	// conta do carrinho, então os valores batem com o que a cliente vê depois.
	const solo = await quoteCart(
		{ regionCode: readCart(cookies).regionCode, items: new Map([[product.slug, 1]]) },
		regions
	);

	return {
		product,
		related,
		estimate: { regionName: solo.region.name, charges: solo.charges, totals: solo.totals }
	};
};
