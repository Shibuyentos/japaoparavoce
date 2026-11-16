import {
	getStoreFees,
	listCategories,
	listHighlightedProducts,
	listKits
} from '#lib/server/catalog.ts';
import { listShippingTable } from '#lib/server/shipping.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [categories, highlightedProducts, kits, fees, shippingTable] = await Promise.all([
		listCategories(),
		listHighlightedProducts(10),
		listKits(),
		getStoreFees(),
		listShippingTable()
	]);

	return { categories, highlightedProducts, kits, fees, shippingTable };
};
