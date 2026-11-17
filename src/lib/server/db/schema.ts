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

// Acompanha o passo a passo da loja: pedido recebido, orçamento enviado no direct,
// pagamento confirmado e caixa postada.
export const ORDER_STATUSES = ['received', 'quoted', 'paid', 'shipped', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

// 'customer' compra na loja; 'admin' também entra no painel.
export const USER_ROLES = ['customer', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

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

// Um pedido guarda uma cópia dos valores do momento em que foi enviado (preços, taxas, frete e
// câmbio), porque todos eles mudam com o tempo. Os totais são calculados a partir dessas cópias.
export const orders = sqliteTable(
	'orders',
	{
		id: integer().primaryKey({ autoIncrement: true }),
		// Código público: identifica o pedido no link de confirmação e na conversa com a cliente.
		code: text().notNull().unique(),
		// Conta de quem fez o pedido. Se a conta for apagada, o pedido continua existindo sem ela.
		userId: integer().references(() => users.id, { onDelete: 'set null' }),
		status: text({ enum: ORDER_STATUSES }).notNull().default('received'),
		customerName: text().notNull(),
		instagramHandle: text().notNull(),
		note: text(),
		shippingRegionId: integer()
			.notNull()
			.references(() => shippingRegions.id),
		domesticShippingJpy: integer().notNull(),
		serviceFeeJpy: integer().notNull(),
		// Nulo quando o peso passa da última faixa da tabela EMS: o frete é combinado caso a caso.
		internationalShippingJpy: integer(),
		brlCentsPerHundredJpy: integer().notNull(),
		createdAt: integer({ mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date()),
		// Quando o pedido chegou a cada passo. O passo "recebido" é o createdAt.
		quotedAt: integer({ mode: 'timestamp' }),
		paidAt: integer({ mode: 'timestamp' }),
		shippedAt: integer({ mode: 'timestamp' }),
		cancelledAt: integer({ mode: 'timestamp' }),
		// Código de rastreio do EMS, informado no painel quando a caixa é postada.
		trackingCode: text()
	},
	(table) => [index('orders_user_id_idx').on(table.userId)]
);

export const orderItems = sqliteTable(
	'order_items',
	{
		id: integer().primaryKey({ autoIncrement: true }),
		orderId: integer()
			.notNull()
			.references(() => orders.id, { onDelete: 'cascade' }),
		productId: integer()
			.notNull()
			.references(() => products.id),
		productName: text().notNull(),
		unitPriceJpy: integer().notNull(),
		priceType: text({ enum: PRICE_TYPES }).notNull(),
		weightGrams: integer().notNull(),
		quantity: integer().notNull()
	},
	(table) => [index('order_items_order_id_idx').on(table.orderId)]
);

// Contas do site: quem compra na loja e quem administra o painel.
export const users = sqliteTable('users', {
	id: integer().primaryKey({ autoIncrement: true }),
	email: text().notNull().unique(),
	name: text().notNull(),
	passwordHash: text().notNull(),
	role: text({ enum: USER_ROLES }).notNull().default('customer'),
	createdAt: integer({ mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const sessions = sqliteTable('sessions', {
	// SHA-256 do token que fica no cookie: quem ler o banco não consegue reutilizar a sessão.
	id: text().primaryKey(),
	userId: integer()
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: integer({ mode: 'timestamp' }).notNull()
});
