import { and, asc, eq, gte } from 'drizzle-orm';
import type { ShippingRegion } from '#lib/types.ts';
import { db } from './db';
import { shippingRates, shippingRegions } from './db/schema';

export async function listShippingRegions(): Promise<ShippingRegion[]> {
	return db
		.select({ id: shippingRegions.id, code: shippingRegions.code, name: shippingRegions.name })
		.from(shippingRegions)
		.orderBy(asc(shippingRegions.position));
}

// Preço da menor faixa EMS que comporta o peso. Devolve null quando o peso passa da última faixa.
export async function findShippingPriceJpy(
	regionId: number,
	weightGrams: number
): Promise<number | null> {
	const [rate] = await db
		.select({ priceJpy: shippingRates.priceJpy })
		.from(shippingRates)
		.where(
			and(eq(shippingRates.regionId, regionId), gte(shippingRates.maxWeightGrams, weightGrams))
		)
		.orderBy(asc(shippingRates.maxWeightGrams))
		.limit(1);

	return rate?.priceJpy ?? null;
}
