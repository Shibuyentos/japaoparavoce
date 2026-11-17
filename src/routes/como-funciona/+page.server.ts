import { getStoreFees } from '#lib/server/catalog.ts';
import { listShippingTable } from '#lib/server/shipping.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [fees, shippingTable] = await Promise.all([getStoreFees(), listShippingTable()]);

	return { fees, shippingTable };
};
