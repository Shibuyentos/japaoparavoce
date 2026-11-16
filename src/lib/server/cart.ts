import type { Cookies } from '@sveltejs/kit';

const COOKIE_NAME = 'cart';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const DEFAULT_REGION_CODE = 'br';

// O carrinho inteiro fica num cookie, então precisa caber no limite de 4 KB do navegador.
const MAX_LINES = 30;
export const MAX_QUANTITY = 20;

export type Cart = {
	regionCode: string;
	// Slug do produto → quantidade, na ordem em que os produtos foram adicionados.
	items: Map<string, number>;
};

function isValidQuantity(value: unknown): value is number {
	return (
		typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= MAX_QUANTITY
	);
}

// O cookie vem do navegador e pode ter sido alterado: o que estiver fora do formato é ignorado.
// Se os slugs e a região existem de verdade é conferido depois, na consulta ao banco.
export function readCart(cookies: Cookies): Cart {
	const cart: Cart = { regionCode: DEFAULT_REGION_CODE, items: new Map() };

	let stored: unknown;
	try {
		stored = JSON.parse(cookies.get(COOKIE_NAME) ?? 'null');
	} catch {
		return cart;
	}
	if (typeof stored !== 'object' || stored === null) return cart;

	const { regionCode, items } = stored as Record<string, unknown>;
	if (typeof regionCode === 'string') cart.regionCode = regionCode;
	if (!Array.isArray(items)) return cart;

	for (const entry of items.slice(0, MAX_LINES)) {
		if (!Array.isArray(entry)) continue;
		const [slug, quantity] = entry;
		if (typeof slug === 'string' && isValidQuantity(quantity)) cart.items.set(slug, quantity);
	}
	return cart;
}

export function writeCart(cookies: Cookies, cart: Cart): void {
	const value = JSON.stringify({ regionCode: cart.regionCode, items: [...cart.items] });
	cookies.set(COOKIE_NAME, value, { path: '/', maxAge: COOKIE_MAX_AGE_SECONDS });
}

export function cartItemCount(cart: Cart): number {
	let count = 0;
	for (const quantity of cart.items.values()) count += quantity;
	return count;
}

// Soma uma unidade de cada produto. Se o carrinho fosse passar do limite de linhas,
// nada é alterado e a função devolve false.
export function addToCart(cart: Cart, slugs: string[]): boolean {
	const newLines = slugs.filter((slug) => !cart.items.has(slug)).length;
	if (cart.items.size + newLines > MAX_LINES) return false;

	for (const slug of slugs) {
		cart.items.set(slug, Math.min((cart.items.get(slug) ?? 0) + 1, MAX_QUANTITY));
	}
	return true;
}
