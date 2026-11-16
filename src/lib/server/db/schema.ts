import {
	index,
	integer,
	primaryKey,
	sqliteTable,
	text,
	uniqueIndex
} from 'drizzle-orm/sqlite-core';

// Valores em ienes são inteiros: o iene não tem centavos.

export const PRICE_TYPES = ['store', 'reference'] as const;
export type PriceType = (typeof PRICE_TYPES)[number];

export const categories = sqliteTable('categories', {
	id: integer().primaryKey({ autoIncrement: true }),
	slug: text().notNull().unique(),
	name: text().notNull(),
	position: integer().notNull()
});

export const products = sqliteTable(
	'products',
	{
		id: integer().primaryKey({ autoIncrement: true }),
		slug: text().notNull().unique(),
		categoryId: integer()
			.notNull()
			.references(() => categories.id),
		name: text().notNull(),
		descriptionPt: text().notNull(),
		descriptionEn: text().notNull(),
		priceJpy: integer().notNull(),
		// 'store': preço conferido na etiqueta da loja. 'reference': preço de loja online,
		// confirmado no orçamento antes do pagamento.
		priceType: text({ enum: PRICE_TYPES }).notNull(),
		// Faixa de peso estimada para o frete, não o peso exato do produto.
		weightGrams: integer().notNull(),
		isLimitedEdition: integer({ mode: 'boolean' }).notNull().default(false),
		image: text(),
		// Nome e descrições normalizados por productSearchText, usados na busca da vitrine.
		searchText: text().notNull(),
		isActive: integer({ mode: 'boolean' }).notNull().default(true),
		createdAt: integer({ mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer({ mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date())
			.$onUpdateFn(() => new Date())
	},
	(table) => [index('products_category_id_idx').on(table.categoryId)]
);

export const kits = sqliteTable('kits', {
	id: integer().primaryKey({ autoIncrement: true }),
	slug: text().notNull().unique(),
	name: text().notNull(),
	description: text().notNull(),
	position: integer().notNull(),
	isActive: integer({ mode: 'boolean' }).notNull().default(true)
});

// O preço e o peso do kit são a soma dos produtos, por isso não são guardados aqui.
export const kitItems = sqliteTable(
	'kit_items',
	{
		kitId: integer()
			.notNull()
			.references(() => kits.id, { onDelete: 'cascade' }),
		productId: integer()
			.notNull()
			.references(() => products.id),
		stepLabel: text().notNull(),
		position: integer().notNull()
	},
	(table) => [primaryKey({ columns: [table.kitId, table.productId] })]
);

export const shippingRegions = sqliteTable('shipping_regions', {
	id: integer().primaryKey({ autoIncrement: true }),
	code: text().notNull().unique(),
	name: text().notNull(),
	position: integer().notNull()
});

// Tabela EMS: uma linha por região e limite de peso (até 500 g, até 1 kg...).
export const shippingRates = sqliteTable(
	'shipping_rates',
	{
		id: integer().primaryKey({ autoIncrement: true }),
		regionId: integer()
			.notNull()
			.references(() => shippingRegions.id, { onDelete: 'cascade' }),
		maxWeightGrams: integer().notNull(),
		priceJpy: integer().notNull()
	},
	(table) => [
		uniqueIndex('shipping_rates_region_weight_idx').on(table.regionId, table.maxWeightGrams)
	]
);

// Uma única linha (id = 1) com as taxas e o câmbio usados nos cálculos.
export const storeSettings = sqliteTable('store_settings', {
	id: integer().primaryKey(),
	domesticShippingJpy: integer().notNull(),
	serviceFeeJpy: integer().notNull(),
	// Centavos de real por ¥100 (340 = R$ 3,40), para não usar ponto flutuante com dinheiro.
	brlCentsPerHundredJpy: integer().notNull(),
	updatedAt: integer({ mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date())
});
