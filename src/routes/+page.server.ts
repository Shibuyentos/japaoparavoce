import { listCategories, listHighlightedProducts, listKits } from '#lib/server/catalog.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [categories, highlightedProducts, kits] = await Promise.all([
		listCategories(),
		listHighlightedProducts(8),
		listKits()
	]);

	return { categories, highlightedProducts, kits };
};
