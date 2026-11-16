import { fail, redirect, type Cookies } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { addToCart, MAX_QUANTITY, readCart, writeCart } from '#lib/server/cart.ts';
import { findProductBySlug, listKits } from '#lib/server/catalog.ts';
import { textField } from '#lib/server/forms.ts';
import { createOrder, quoteCart, validateOrderCustomer } from '#lib/server/orders.ts';
import { listShippingRegions } from '#lib/server/shipping.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const cart = readCart(cookies);
	const regions = await listShippingRegions();
	const quote = await quoteCart(cart, regions);

	// Produtos que saíram da vitrine depois de entrar no carrinho também saem do cookie.
	if (quote.lines.length < cart.items.size) {
		cart.items = new Map(quote.lines.map((line) => [line.slug, line.quantity]));
		writeCart(cookies, cart);
	}

	return { quote, regions, maxQuantity: MAX_QUANTITY };
};

function addProducts(cookies: Cookies, slugs: string[]) {
	const cart = readCart(cookies);
	if (!addToCart(cart, slugs)) {
		return fail(400, {
			message: 'Seu pedido já está com muitos produtos diferentes. Envie este e monte outro 😊'
		});
	}
	writeCart(cookies, cart);
}

export const actions: Actions = {
	add: async ({ request, cookies }) => {
		const product = await findProductBySlug(textField(await request.formData(), 'slug'));
		if (!product) return fail(404, { message: 'Esse produto não está mais na vitrine.' });

		return addProducts(cookies, [product.slug]);
	},

	addKit: async ({ request, cookies }) => {
		const slug = textField(await request.formData(), 'slug');
		const kit = (await listKits()).find((candidate) => candidate.slug === slug);
		if (!kit) return fail(404, { message: 'Esse kit não está mais disponível.' });

		return addProducts(
			cookies,
			kit.steps.map((step) => step.product.slug)
		);
	},

	// Os botões de − e + enviam a quantidade nova; "Remover" envia zero.
	update: async ({ request, cookies }) => {
		const data = await request.formData();
		const slug = textField(data, 'slug');
		const quantity = Number(textField(data, 'quantity'));

		const cart = readCart(cookies);
		if (!cart.items.has(slug) || !Number.isInteger(quantity) || quantity < 0) {
			return fail(400, { message: 'Não foi possível atualizar o pedido. Tente de novo.' });
		}

		if (quantity === 0) cart.items.delete(slug);
		else cart.items.set(slug, Math.min(quantity, MAX_QUANTITY));
		writeCart(cookies, cart);
	},

	region: async ({ request, cookies }) => {
		const code = textField(await request.formData(), 'region');
		const regions = await listShippingRegions();
		if (!regions.some((region) => region.code === code)) {
			return fail(400, { message: 'Escolha uma região de entrega da lista.' });
		}

		const cart = readCart(cookies);
		cart.regionCode = code;
		writeCart(cookies, cart);
	},

	checkout: async ({ request, cookies }) => {
		const data = await request.formData();
		const values = {
			name: textField(data, 'name'),
			instagram: textField(data, 'instagram'),
			note: textField(data, 'note')
		};

		const validation = validateOrderCustomer(values);
		if (!validation.ok) return fail(400, { values, errors: validation.errors });

		const cart = readCart(cookies);
		const quote = await quoteCart(cart, await listShippingRegions());
		if (quote.lines.length === 0) {
			return fail(400, {
				values,
				message: 'Seu pedido está vazio. Escolha os produtos na vitrine.'
			});
		}

		const code = await createOrder(quote, validation.customer);

		cart.items.clear();
		writeCart(cookies, cart);
		redirect(303, resolve('/pedidos/[code]', { code }));
	}
};
