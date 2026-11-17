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

// O peso de um produto é uma faixa estimada para o frete, não o peso exato.
export function weightBandLabel(grams: number): string {
	return `até ${formatWeight(grams)}`;
}

export function weightBandName(grams: number): string {
	return grams <= 500 ? 'Leve' : grams <= 1500 ? 'Médio' : 'Pesado';
}

export function countLabel(count: number, singular: string, plural: string): string {
	return count === 1 ? `1 ${singular}` : `${count} ${plural}`;
}

export function formatDateTime(date: Date): string {
	return dateTimeFormat.format(date);
}

const storeDayFormat = new Intl.DateTimeFormat('pt-BR', {
	weekday: 'long',
	day: 'numeric',
	month: 'long',
	timeZone: STORE_TIME_ZONE
});

// O dia de hoje no calendário da loja, como "segunda-feira, 17 de novembro".
export function formatStoreDay(date: Date): string {
	return storeDayFormat.format(date);
}

const HOUR_MS = 60 * 60 * 1000;

// Há quanto tempo um pedido espera: em horas no primeiro dia, em dias depois disso.
export function formatWaiting(since: Date, now = new Date()): string {
	const hours = Math.floor((now.getTime() - since.getTime()) / HOUR_MS);
	if (hours < 1) return 'há menos de 1 h';
	if (hours < 24) return `há ${hours} h`;

	const days = Math.floor(hours / 24);
	return days === 1 ? 'há 1 dia' : `há ${days} dias`;
}

// Os dias do resumo chegam como 'AAAA-MM-DD', já no calendário da loja. Tratar a data
// como UTC evita que o fuso de quem está vendo a página mude o dia exibido.
const dayFormat = new Intl.DateTimeFormat('pt-BR', {
	day: '2-digit',
	month: '2-digit',
	timeZone: 'UTC'
});
const weekdayFormat = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', timeZone: 'UTC' });

export function formatDay(dateKey: string): string {
	return dayFormat.format(new Date(`${dateKey}T00:00:00Z`));
}

export function formatWeekday(dateKey: string): string {
	return weekdayFormat.format(new Date(`${dateKey}T00:00:00Z`));
}
