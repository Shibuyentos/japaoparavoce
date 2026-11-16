export function jpyToBrlCents(priceJpy: number, brlCentsPerHundredJpy: number): number {
	return Math.round((priceJpy * brlCentsPerHundredJpy) / 100);
}
