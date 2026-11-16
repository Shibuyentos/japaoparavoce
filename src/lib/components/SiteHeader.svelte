<script lang="ts">
	import ShoppingBag from '@lucide/svelte/icons/shopping-bag';
	import UserRound from '@lucide/svelte/icons/user-round';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { INSTAGRAM_URL, STORE_NAME } from '#lib/config.ts';
	import type { SessionUser } from '#lib/types.ts';
	import InstagramIcon from './InstagramIcon.svelte';

	type Props = {
		cartItemCount: number;
		user: SessionUser | null;
	};

	let { cartItemCount, user }: Props = $props();

	const firstName = $derived(user?.name.split(' ')[0]);

	const cartLabel = $derived(
		cartItemCount === 1 ? 'Meu pedido: 1 item' : `Meu pedido: ${cartItemCount} itens`
	);

	const links = [
		{ href: resolve('/vitrine'), label: 'Vitrine', hideOnMobile: false },
		{ href: resolve('/#kits'), label: 'Kits', hideOnMobile: false },
		{ href: resolve('/#como-funciona'), label: 'Como funciona', hideOnMobile: true }
	];
</script>

<header class="site-header">
	<div class="wrap bar">
		<!-- No celular só o logo aparece, então o nome acessível vem do aria-label. -->
		<a class="brand" href={resolve('/')} aria-label={STORE_NAME}>
			<img src="/images/site/logo.webp" alt="" width="40" height="40" />
			<span>{STORE_NAME}</span>
		</a>

		<nav aria-label="Principal">
			{#each links as link (link.href)}
				<a
					href={link.href}
					class:hide-mobile={link.hideOnMobile}
					aria-current={page.url.pathname.startsWith(link.href) ? 'page' : undefined}
				>
					{link.label}
				</a>
			{/each}
			<a
				class="cart"
				href={resolve('/carrinho')}
				aria-label={cartLabel}
				aria-current={page.url.pathname === resolve('/carrinho') ? 'page' : undefined}
			>
				<ShoppingBag />
				<span class="hide-mobile">Meu pedido</span>
				{#if cartItemCount > 0}
					<span class="count">{cartItemCount}</span>
				{/if}
			</a>
			{#if user}
				<a
					class="account"
					href={resolve('/conta')}
					aria-label="Minha conta"
					aria-current={page.url.pathname.startsWith(resolve('/conta')) ? 'page' : undefined}
				>
					<UserRound />
					<span class="hide-mobile">Olá, {firstName}</span>
				</a>
			{:else}
				<a
					class="account"
					href={resolve('/entrar')}
					aria-label="Entrar na minha conta"
					aria-current={page.url.pathname === resolve('/entrar') ? 'page' : undefined}
				>
					<UserRound />
					<span class="hide-mobile">Entrar</span>
				</a>
			{/if}
			<!-- No celular o Instagram sai do cabeçalho para caber a conta; ele continua no rodapé. -->
			<a class="instagram hide-mobile" href={INSTAGRAM_URL} target="_blank" rel="external noopener">
				<InstagramIcon />
				Instagram
			</a>
		</nav>
	</div>
</header>

<style>
	.site-header {
		border-bottom: 1px solid var(--line);
		background: var(--surface);
	}

	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		min-height: 64px;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		color: var(--ink);
		font-weight: 800;
		font-size: 17px;
	}

	.brand img {
		width: 40px;
		height: 40px;
		border-radius: 12px;
		object-fit: cover;
	}

	nav {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	nav a {
		text-decoration: none;
		color: var(--ink);
		font-weight: 700;
		font-size: 15.5px;
		padding: 8px 12px;
		border-radius: 999px;
	}

	nav a:hover,
	nav a[aria-current='page'] {
		color: var(--pink-dark);
		background: var(--chip-bg);
	}

	.account,
	.cart,
	.instagram {
		display: inline-flex;
		align-items: center;
		gap: 7px;
	}

	.count {
		min-width: 22px;
		padding: 0 6px;
		border-radius: 999px;
		background: var(--pink);
		color: #ffffff;
		font-size: 13px;
		line-height: 22px;
		text-align: center;
	}

	.instagram {
		background: var(--pink);
		color: #ffffff;
		margin-left: 4px;
	}

	nav .instagram:hover {
		background: var(--pink-dark);
		color: #ffffff;
	}

	.account :global(svg),
	.cart :global(svg),
	.instagram :global(svg) {
		width: 18px;
		height: 18px;
	}

	@media (max-width: 639px) {
		.brand span,
		.hide-mobile {
			display: none;
		}
	}
</style>
