import { error } from '@sveltejs/kit';
import { findProductBySlug } from '#lib/server/catalog.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const product = await findProductBySlug(params.slug);
	if (!product) error(404, 'Produto não encontrado');

	return { product };
};
