import { error } from '@sveltejs/kit';
import { findProductBySlug, getStoreFees, listProducts } from '#lib/server/catalog.ts';
import type { PageServerLoad } from './$types';

const RELATED_COUNT = 5;

export const load: PageServerLoad = async ({ params }) => {
	const product = await findProductBySlug(params.slug);
	if (!product) error(404, 'Produto não encontrado');

	const [fees, sameCategory] = await Promise.all([
		getStoreFees(),
		listProducts({ categorySlug: product.categorySlug })
	]);

	// Os vizinhos do produto na ordem alfabética da categoria, dando a volta no fim da lista:
	// assim cada página sugere produtos diferentes.
	const position = sameCategory.findIndex((candidate) => candidate.slug === product.slug);
	const related = [...sameCategory.slice(position + 1), ...sameCategory.slice(0, position)].slice(
		0,
		RELATED_COUNT
	);

	return { product, fees, related };
};
