import { readFileSync } from 'node:fs';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../src/lib/server/db/schema.ts';
import type { PriceType } from '../src/lib/server/db/schema.ts';
import { productSearchText } from '../src/lib/server/search.ts';

type SeedCatalog = {
	settings: { domesticShippingJpy: number; serviceFeeJpy: number; brlCentsPerHundredJpy: number };
	shippingRegions: {
		code: string;
		name: string;
		rates: { maxWeightGrams: number; priceJpy: number }[];
	}[];
	categories: { slug: string; name: string }[];
	products: {
		slug: string;
		name: string;
		category: string;
		descriptionPt: string;
		descriptionEn: string;
		priceJpy: number;
		priceType: PriceType;
		weightGrams: number;
		isLimitedEdition: boolean;
		image: string | null;
	}[];
	kits: {
		slug: string;
		name: string;
		description: string;
		items: { stepLabel: string; productSlug: string }[];
	}[];
};

function requireId(ids: Map<string, number>, key: string): number {
	const id = ids.get(key);
	if (id === undefined) throw new Error(`"${key}" não existe no catálogo de seed`);
	return id;
}

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

const db = drizzle(createClient({ url }), { schema, casing: 'snake_case' });

const catalog: SeedCatalog = JSON.parse(
	readFileSync(new URL('./catalog.json', import.meta.url), 'utf8')
);

const existingProducts = await db.select({ id: schema.products.id }).from(schema.products).limit(1);
if (existingProducts.length > 0) {
	console.log('O banco já tem produtos, nada foi alterado.');
	process.exit(0);
}

await db.transaction(async (tx) => {
	await tx.insert(schema.storeSettings).values({ id: 1, ...catalog.settings });

	for (const [position, { rates, ...region }] of catalog.shippingRegions.entries()) {
		const [created] = await tx
			.insert(schema.shippingRegions)
			.values({ ...region, position })
			.returning({ id: schema.shippingRegions.id });
		await tx
			.insert(schema.shippingRates)
			.values(rates.map((rate) => ({ ...rate, regionId: created.id })));
	}

	const categories = await tx
		.insert(schema.categories)
		.values(catalog.categories.map((category, position) => ({ ...category, position })))
		.returning({ id: schema.categories.id, slug: schema.categories.slug });
	const categoryIds = new Map(categories.map((category) => [category.slug, category.id]));

	const products = await tx
		.insert(schema.products)
		.values(
			catalog.products.map(({ category, ...product }) => ({
				...product,
				categoryId: requireId(categoryIds, category),
				searchText: productSearchText(product)
			}))
		)
		.returning({ id: schema.products.id, slug: schema.products.slug });
	const productIds = new Map(products.map((product) => [product.slug, product.id]));

	for (const [position, { items, ...kit }] of catalog.kits.entries()) {
		const [created] = await tx
			.insert(schema.kits)
			.values({ ...kit, position })
			.returning({ id: schema.kits.id });
		await tx.insert(schema.kitItems).values(
			items.map((item, itemPosition) => ({
				kitId: created.id,
				productId: requireId(productIds, item.productSlug),
				stepLabel: item.stepLabel,
				position: itemPosition
			}))
		);
	}
});

console.log(
	`Seed concluído: ${catalog.products.length} produtos, ${catalog.kits.length} kits, ` +
		`${catalog.shippingRegions.length} regiões de frete.`
);
