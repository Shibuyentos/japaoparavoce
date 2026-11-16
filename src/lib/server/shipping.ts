import { and, asc, eq, gte } from 'drizzle-orm';
import type { ShippingRegion, ShippingRegionRates } from '#lib/types.ts';
import { db } from './db';
import { shippingRates, shippingRegions } from './db/schema';

export async function listShippingRegions(): Promise<ShippingRegion[]> {
	return db
		.select({ id: shippingRegions.id, code: shippingRegions.code, name: shippingRegions.name })
		.from(shippingRegions)
		.orderBy(asc(shippingRegions.position));
}

// A tabela EMS inteira, para a loja mostrar quanto custa o frete de cada faixa de peso.
export async function listShippingTable(): Promise<ShippingRegionRates[]> {
	const rows = await db
		.select({
			code: shippingRegions.code,
			name: shippingRegions.name,
			maxWeightGrams: shippingRates.maxWeightGrams,
			priceJpy: shippingRates.priceJpy
		})
		.from(shippingRegions)
		.innerJoin(shippingRates, eq(shippingRates.regionId, shippingRegions.id))
		.orderBy(asc(shippingRegions.position), asc(shippingRates.maxWeightGrams));

	const regions = new Map<string, ShippingRegionRates>();
	for (const { code, name, ...rate } of rows) {
		let region = regions.get(code);
		if (!region) {
			region = { code, name, rates: [] };
			regions.set(code, region);
		}
		region.rates.push(rate);
	}
	return [...regions.values()];
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
