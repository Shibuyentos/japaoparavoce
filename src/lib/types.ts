import type { OrderStatus, PriceType } from './server/db/schema';

export type { OrderStatus, PriceType };

export type CategoryWithCount = {
	slug: string;
	name: string;
	productCount: number;
};

export type ProductSummary = {
	slug: string;
	name: string;
	description: string;
	categorySlug: string;
	categoryName: string;
	priceJpy: number;
	priceBrlCents: number;
	priceType: PriceType;
	weightGrams: number;
	isLimitedEdition: boolean;
	image: string | null;
};

export type KitStep = {
	label: string;
	product: Pick<ProductSummary, 'slug' | 'name' | 'image' | 'priceJpy' | 'priceBrlCents'>;
};

export type KitSummary = {
	slug: string;
	name: string;
	description: string;
	steps: KitStep[];
	totalJpy: number;
	totalBrlCents: number;
	totalWeightGrams: number;
};

export type ShippingRegion = {
	id: number;
	code: string;
	name: string;
};

export type OrderLine = {
	name: string;
	priceType: PriceType;
	unitPriceJpy: number;
	weightGrams: number;
	quantity: number;
};

// Linha do carrinho: além dos valores, aponta para o produto que ainda está na vitrine.
export type CartLine = OrderLine & {
	productId: number;
	slug: string;
	image: string | null;
};

export type OrderCharges = {
	domesticShippingJpy: number;
	serviceFeeJpy: number;
	// Nulo quando o peso passa da última faixa da tabela EMS: o frete é combinado caso a caso.
	internationalShippingJpy: number | null;
	brlCentsPerHundredJpy: number;
};

export type OrderTotals = {
	itemCount: number;
	weightGrams: number;
	productsJpy: number;
	// Não inclui o frete internacional enquanto ele não estiver definido.
	totalJpy: number;
	totalBrlCents: number;
};

export type CartQuote = {
	region: ShippingRegion;
	lines: CartLine[];
	charges: OrderCharges;
	totals: OrderTotals;
};

export type OrderDetails = {
	code: string;
	regionName: string;
	lines: OrderLine[];
	charges: OrderCharges;
	totals: OrderTotals;
};

export type AdminUser = {
	id: number;
	name: string;
	email: string;
};

// Pedido como o painel vê: inclui o status e os dados da cliente.
export type AdminOrderDetails = OrderDetails & {
	status: OrderStatus;
	customerName: string;
	instagramHandle: string;
	note: string | null;
	createdAt: Date;
};

export type AdminOrderSummary = {
	code: string;
	status: OrderStatus;
	customerName: string;
	instagramHandle: string;
	regionName: string;
	itemCount: number;
	totalJpy: number;
	createdAt: Date;
};
