import type { OrderCharges, OrderLine, OrderTotals } from '#lib/types.ts';

export function jpyToBrlCents(priceJpy: number, brlCentsPerHundredJpy: number): number {
	return Math.round((priceJpy * brlCentsPerHundredJpy) / 100);
}

type PricedLine = Pick<OrderLine, 'unitPriceJpy' | 'weightGrams' | 'quantity'>;

export function orderWeightGrams(lines: PricedLine[]): number {
	return lines.reduce((sum, line) => sum + line.weightGrams * line.quantity, 0);
}

export function calculateOrderTotals(lines: PricedLine[], charges: OrderCharges): OrderTotals {
	const productsJpy = lines.reduce((sum, line) => sum + line.unitPriceJpy * line.quantity, 0);
	const totalJpy =
		productsJpy +
		charges.domesticShippingJpy +
		charges.serviceFeeJpy +
		(charges.internationalShippingJpy ?? 0);

	return {
		itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
		weightGrams: orderWeightGrams(lines),
		productsJpy,
		totalJpy,
		totalBrlCents: jpyToBrlCents(totalJpy, charges.brlCentsPerHundredJpy)
	};
}
