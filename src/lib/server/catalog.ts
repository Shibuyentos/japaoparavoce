import { and, asc, count, desc, eq, like, sql, type SQL } from 'drizzle-orm';
import type { CategoryWithCount, KitSummary, ProductSummary } from '#lib/types.ts';
import { db } from './db';
import { categories, kitItems, kits, products } from './db/schema';
import { jpyToBrlCents } from './pricing';
import { normalizeSearchText } from './search';

export async function getStoreSettings() {
	const settings = await db.query.storeSettings.findFirst();
	if (!settings) throw new Error('Configurações da loja não encontradas. Rode "npm run db:seed".');
	return settings;
}

export async function listCategories(): Promise<CategoryWithCount[]> {
	return db
		.select({
			slug: categories.slug,
			name: categories.name,
			productCount: count(products.id)
		})
		.from(categories)
		.leftJoin(products, and(eq(products.categoryId, categories.id), eq(products.isActive, true)))
		.groupBy(categories.id)
		.orderBy(asc(categories.position));
}

const productColumns = {
	slug: products.slug,
	name: products.name,
	description: products.descriptionPt,
	categorySlug: categories.slug,
	categoryName: categories.name,
	priceJpy: products.priceJpy,
	priceType: products.priceType,
	weightGrams: products.weightGrams,
	isLimitedEdition: products.isLimitedEdition,
	image: products.image
};

type ProductRow = Omit<ProductSummary, 'priceBrlCents'>;

async function withBrlPrices(rows: ProductRow[]): Promise<ProductSummary[]> {
	const { brlCentsPerHundredJpy } = await getStoreSettings();
	return rows.map((row) => ({
		...row,
		priceBrlCents: jpyToBrlCents(row.priceJpy, brlCentsPerHundredJpy)
	}));
}

export type ProductFilters = {
	categorySlug?: string;
	search?: string;
};

export async function listProducts({ categorySlug, search }: ProductFilters) {
	const conditions: SQL[] = [eq(products.isActive, true)];

	if (categorySlug) conditions.push(eq(categories.slug, categorySlug));

	// Cada palavra precisa aparecer no texto do produto, em qualquer ordem.
	const words = normalizeSearchText(search ?? '')
		.split(' ')
		.filter(Boolean);
	for (const word of words) conditions.push(like(products.searchText, `%${word}%`));

	const rows = await db
		.select(productColumns)
		.from(products)
		.innerJoin(categories, eq(categories.id, products.categoryId))
		.where(and(...conditions))
		.orderBy(asc(sql`lower(${products.name})`));

	return withBrlPrices(rows);
}

// Edições limitadas primeiro, depois os produtos cadastrados mais recentemente.
export async function listHighlightedProducts(limit: number) {
	const rows = await db
		.select(productColumns)
		.from(products)
		.innerJoin(categories, eq(categories.id, products.categoryId))
		.where(eq(products.isActive, true))
		.orderBy(desc(products.isLimitedEdition), desc(products.id))
		.limit(limit);

	return withBrlPrices(rows);
}

export async function findProductBySlug(slug: string): Promise<ProductSummary | undefined> {
	const rows = await db
		.select(productColumns)
		.from(products)
		.innerJoin(categories, eq(categories.id, products.categoryId))
		.where(and(eq(products.slug, slug), eq(products.isActive, true)));

	const [product] = await withBrlPrices(rows);
	return product;
}

export async function listKits(): Promise<KitSummary[]> {
	const [{ brlCentsPerHundredJpy }, rows] = await Promise.all([
		getStoreSettings(),
		db
			.select({
				slug: kits.slug,
				name: kits.name,
				description: kits.description,
				stepLabel: kitItems.stepLabel,
				product: {
					slug: products.slug,
					name: products.name,
					image: products.image,
					priceJpy: products.priceJpy,
					weightGrams: products.weightGrams
				}
			})
			.from(kits)
			.innerJoin(kitItems, eq(kitItems.kitId, kits.id))
			.innerJoin(products, eq(products.id, kitItems.productId))
			.where(eq(kits.isActive, true))
			.orderBy(asc(kits.position), asc(kitItems.position))
	]);

	const kitsBySlug = new Map<string, KitSummary>();

	for (const { slug, name, description, stepLabel, product } of rows) {
		let kit = kitsBySlug.get(slug);
		if (!kit) {
			kit = {
				slug,
				name,
				description,
				steps: [],
				totalJpy: 0,
				totalBrlCents: 0,
				totalWeightGrams: 0
			};
			kitsBySlug.set(slug, kit);
		}

		kit.steps.push({
			label: stepLabel,
			product: {
				slug: product.slug,
				name: product.name,
				image: product.image,
				priceJpy: product.priceJpy,
				priceBrlCents: jpyToBrlCents(product.priceJpy, brlCentsPerHundredJpy)
			}
		});
		kit.totalJpy += product.priceJpy;
		kit.totalWeightGrams += product.weightGrams;
	}

	return [...kitsBySlug.values()].map((kit) => ({
		...kit,
		totalBrlCents: jpyToBrlCents(kit.totalJpy, brlCentsPerHundredJpy)
	}));
}
