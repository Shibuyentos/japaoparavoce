import { STORE_TIME_ZONE } from './config.ts';

const integerFormat = new Intl.NumberFormat('pt-BR');
const kilogramFormat = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });
const brlFormat = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const dateTimeFormat = new Intl.DateTimeFormat('pt-BR', {
	dateStyle: 'short',
	timeStyle: 'short',
	timeZone: STORE_TIME_ZONE
});

export function formatJpy(value: number): string {
	return `¥ ${integerFormat.format(value)}`;
}

export function formatBrl(cents: number): string {
	return brlFormat.format(cents / 100);
}

export function formatWeight(grams: number): string {
	return grams >= 1000 ? `${kilogramFormat.format(grams / 1000)} kg` : `${grams} g`;
}

export function weightBandLabel(grams: number): string {
	const size = grams <= 500 ? 'Leve' : grams <= 1500 ? 'Médio' : 'Pesado';
	return `${size} · até ${formatWeight(grams)}`;
}

export function formatDateTime(date: Date): string {
	return dateTimeFormat.format(date);
}
