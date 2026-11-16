import { cartItemCount, readCart } from '#lib/server/cart.ts';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies, locals }) => {
	return { cartItemCount: cartItemCount(readCart(cookies)), user: locals.user };
};
