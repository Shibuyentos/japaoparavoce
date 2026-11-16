import { cartItemCount, readCart } from '#lib/server/cart.ts';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies }) => {
	return { cartItemCount: cartItemCount(readCart(cookies)) };
};
