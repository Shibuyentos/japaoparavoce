<script lang="ts">
	import ShoppingBag from '@lucide/svelte/icons/shopping-bag';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { INSTAGRAM_URL, STORE_NAME } from '#lib/config.ts';
	import { countLabel } from '#lib/format.ts';
	import InstagramIcon from './InstagramIcon.svelte';

	let { cartItemCount }: { cartItemCount: number } = $props();

	const cartLabel = $derived(`Meu pedido: ${countLabel(cartItemCount, 'item', 'itens')}`);

	// No celular só a vitrine cabe ao lado da sacola; os outros links também estão no rodapé.
	const links = [
		{ href: resolve('/vitrine'), label: 'Vitrine', wideOnly: false },
		{ href: resolve('/#kits'), label: 'Kits', wideOnly: true },
		{ href: resolve('/#como-funciona'), label: 'Como funciona', wideOnly: true },
		{ href: resolve('/pedidos'), label: 'Acompanhar pedido', wideOnly: true }
	];
</script>

<header class="site-header">
	<div class="wrap wrap-wide bar">
		<a class="brand" href={resolve('/')}>
			<img src="/images/site/icone-192.webp" alt="" width="36" height="36" />
			<span>{STORE_NAME}</span>
		</a>

		<nav aria-label="Principal">
			{#each links as link (link.href)}
				<a
					class="link"
					class:wide-only={link.wideOnly}
					href={link.href}
					aria-current={page.url.pathname.startsWith(link.href) ? 'page' : undefined}
				>
					{link.label}
				</a>
			{/each}
			<a
				class="link wide-only instagram"
				href={INSTAGRAM_URL}
				target="_blank"
				rel="external noopener"
				aria-label="Instagram (abre em outra aba)"
			>
				<InstagramIcon />
			</a>
			<a
				class="cart"
				href={resolve('/carrinho')}
				aria-label={cartLabel}
				aria-current={page.url.pathname === resolve('/carrinho') ? 'page' : undefined}
			>
				<ShoppingBag />
				<span class="wide-only">Meu pedido</span>
				{#if cartItemCount > 0}
					<!-- A chave refaz o elemento a cada mudança, o que repete a animação do contador. -->
					{#key cartItemCount}
						<span class="count">{cartItemCount}</span>
					{/key}
				{/if}
			</a>
		</nav>
	</div>
</header>

<style>
	.site-header {
		position: sticky;
		top: 0;
		z-index: 10;
		border-bottom: 1px solid var(--line);
		background: var(--paper);
	}

	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		height: var(--header-height);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: 44px;
		font-family: var(--font-display);
		font-size: 1.0625rem;
		font-weight: 700;
		white-space: nowrap;
		color: var(--ink);
		text-decoration: none;
	}

	.brand img {
		width: 36px;
		height: 36px;
	}

	nav {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.link {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 0 10px;
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--ink);
		text-decoration: none;
	}

	.link:hover,
	.link[aria-current='page'] {
		text-decoration: underline;
		text-decoration-color: var(--beni);
		text-decoration-thickness: 2px;
		text-underline-offset: 6px;
	}

	.instagram :global(svg) {
		width: 20px;
		height: 20px;
	}

	.cart {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		min-width: 44px;
		min-height: 40px;
		padding: 0 10px;
		border: 1.5px solid var(--ink);
		border-radius: var(--radius);
		font-size: 0.9375rem;
		font-weight: 700;
		color: var(--ink);
		text-decoration: none;
	}

	.cart:hover,
	.cart[aria-current='page'] {
		background: var(--blush);
	}

	.cart :global(svg) {
		width: 19px;
		height: 19px;
	}

	.count {
		min-width: 22px;
		padding: 0 6px;
		border-radius: 11px;
		background: var(--beni);
		font-size: 0.8125rem;
		font-variant-numeric: tabular-nums;
		line-height: 22px;
		text-align: center;
		color: var(--white);
		animation: bump 0.3s ease-out;
	}

	@keyframes bump {
		from {
			transform: scale(1.45);
		}
	}

	.wide-only {
		display: none;
	}

	@media (max-width: 350px) {
		.brand span {
			display: none;
		}
	}

	@media (min-width: 860px) {
		nav {
			gap: 6px;
		}

		.wide-only {
			display: inline-flex;
		}

		.cart {
			margin-left: 8px;
		}
	}
</style>
