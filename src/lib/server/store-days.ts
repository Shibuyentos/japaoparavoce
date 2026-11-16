import { STORE_TIME_ZONE } from '#lib/config.ts';

const DAY_MS = 24 * 60 * 60 * 1000;

const storeClock = new Intl.DateTimeFormat('en-US', {
	timeZone: STORE_TIME_ZONE,
	hourCycle: 'h23',
	year: 'numeric',
	month: 'numeric',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
	second: 'numeric'
});

// O que o relógio da loja marca num instante, escrito como se fosse UTC. Com isso as
// contas de dia são feitas em UTC e não dependem do fuso do servidor.
function storeClockAsUtc(instant: Date): number {
	const clock: Record<string, number> = {};
	for (const { type, value } of storeClock.formatToParts(instant)) {
		if (type !== 'literal') clock[type] = Number(value);
	}
	return Date.UTC(clock.year, clock.month - 1, clock.day, clock.hour, clock.minute, clock.second);
}

// Dia do calendário da loja em que um instante cai, como 'AAAA-MM-DD'.
export function storeDateKey(instant: Date): string {
	return new Date(storeClockAsUtc(instant)).toISOString().slice(0, 10);
}

// Instante em que um dia começa na loja. Usa a diferença para o UTC em vigor nesse dia,
// que no Japão é sempre a mesma porque lá não há horário de verão.
export function storeDayStart(dateKey: string): Date {
	const utcMidnight = Date.parse(`${dateKey}T00:00:00Z`);
	const offset = storeClockAsUtc(new Date(utcMidnight)) - utcMidnight;
	return new Date(utcMidnight - offset);
}

// Os últimos `count` dias do calendário da loja, do mais antigo até hoje.
export function lastStoreDays(now: Date, count: number): string[] {
	const today = Date.parse(`${storeDateKey(now)}T00:00:00Z`);
	return Array.from({ length: count }, (_, index) =>
		new Date(today - (count - 1 - index) * DAY_MS).toISOString().slice(0, 10)
	);
}
