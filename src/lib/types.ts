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
