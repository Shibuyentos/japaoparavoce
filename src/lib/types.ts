import type { PriceType } from './server/db/schema';

export type { PriceType };

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
