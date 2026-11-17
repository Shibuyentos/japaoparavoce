<script lang="ts">
	import Menu from '@lucide/svelte/icons/menu';
	import ShoppingBag from '@lucide/svelte/icons/shopping-bag';
	import UserRound from '@lucide/svelte/icons/user-round';
	import X from '@lucide/svelte/icons/x';
	import { afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { INSTAGRAM_HANDLE, INSTAGRAM_URL, STORE_NAME } from '#lib/config.ts';
	import { countLabel } from '#lib/format.ts';
	import type { SessionUser } from '#lib/types.ts';
	import InstagramIcon from './InstagramIcon.svelte';

	type Props = {
		cartItemCount: number;
		user: SessionUser | null;
	};

	let { cartItemCount, user }: Props = $props();

	const firstName = $derived(user?.name.split(' ')[0]);
	const cartLabel = $derived(`Carrinho: ${countLabel(cartItemCount, 'item', 'itens')}`);

	// Os mesmos destinos aparecem na barra (telas largas) e no menu (celular).
	const links = [
		{ href: resolve('/vitrine'), label: 'Vitrine' },
		{ href: resolve('/#kits'), label: 'Kits' },
		{ href: resolve('/como-funciona'), label: 'Como funciona' },
		{ href: resolve('/endereco-no-japao'), label: 'Endereço no Japão' }
	];

	const helpLinks = [
		{ href: resolve('/como-funciona#valores'), label: 'Fretes e taxas' },
		{ href: resolve('/como-funciona#avisos'), label: 'Antes de pedir' }
	];

	let menu = $state<HTMLElement>();

	// O menu fica no layout: sem fechar, ele continuaria aberto na página seguinte.
	afterNavigate(() => {
		if (menu?.matches(':popover-open')) menu.hidePopover();
	});

	function isCurrent(href: string): boolean {
		return !href.includes('#') && page.url.pathname.startsWith(href);
	}
</script>

<header class="site-header">
	<div class="wrap bar">
		<a class="brand" href={resolve('/')}>
			<img src="/images/site/icone-192.webp" alt="" width="36" height="36" />
			<span>{STORE_NAME}</span>
		</a>

		<nav class="main-nav" aria-label="Principal">
			{#each links as link (link.href)}
				<a href={link.href} aria-current={isCurrent(link.href) ? 'page' : undefined}>
					{link.label}
				</a>
			{/each}
		</nav>

		<div class="actions">
			<a
				class="icon-link wide-only"
				href={INSTAGRAM_URL}
				target="_blank"
				rel="external noopener"
				aria-label="Instagram {INSTAGRAM_HANDLE} (abre em outra aba)"
			>
				<InstagramIcon />
			</a>
			<a
				class="account wide-only"
				href={user ? resolve('/conta') : resolve('/entrar')}
				aria-current={isCurrent(resolve('/conta')) ? 'page' : undefined}
			>
				<UserRound aria-hidden="true" />
				{user ? `Olá, ${firstName}` : 'Entrar'}
			</a>
			<a
				class="cart"
				href={resolve('/carrinho')}
				aria-label={cartLabel}
				aria-current={page.url.pathname === resolve('/carrinho') ? 'page' : undefined}
			>
				<ShoppingBag aria-hidden="true" />
				<span class="wide-only">Carrinho</span>
				{#if cartItemCount > 0}
					<!-- A chave refaz o elemento a cada mudança, o que repete a animação do contador. -->
					{#key cartItemCount}
						<span class="count">{cartItemCount}</span>
					{/key}
				{/if}
			</a>
			<button class="menu-button" type="button" popovertarget="menu" aria-label="Abrir o menu">
				<Menu aria-hidden="true" />
			</button>
		</div>
	</div>
</header>

<nav id="menu" class="menu" popover bind:this={menu} aria-label="Menu">
	<div class="menu-top">
		<span class="menu-title">Menu</span>
		<button
			class="menu-button"
			type="button"
			popovertarget="menu"
			popovertargetaction="hide"
			aria-label="Fechar o menu"
		>
			<X aria-hidden="true" />
		</button>
	</div>

	<ul class="menu-main">
		{#each links as link (link.href)}
			<li><a href={link.href}>{link.label}</a></li>
		{/each}
	</ul>

	<ul class="menu-help">
		{#each helpLinks as link (link.href)}
			<li><a href={link.href}>{link.label}</a></li>
		{/each}
	</ul>

	<div class="menu-account">
		{#if user}
			<p>Conta de {user.name}</p>
			<a class="btn btn-quiet" href={resolve('/conta/pedidos')}>Meus pedidos</a>
			<a class="text-link" href={resolve('/conta')}>Minha conta</a>
		{:else}
			<a class="btn btn-quiet" href={resolve('/entrar')}>Entrar</a>
			<a class="text-link" href={resolve('/cadastro')}>Criar conta</a>
		{/if}
	</div>

	<a class="menu-instagram" href={INSTAGRAM_URL} target="_blank" rel="external noopener">
		<InstagramIcon />
		<span>
			Atendimento pelo direct
			<strong>{INSTAGRAM_HANDLE}</strong>
		</span>
	</a>
</nav>

<style>
	.site-header {
		position: sticky;
		top: 0;
		z-index: 10;
		border-bottom: 1px solid var(--line);
		background: rgb(252 246 247 / 0.94);
		backdrop-filter: blur(10px);
	}

	.bar {
		display: flex;
		align-items: center;
		gap: 12px;
		height: var(--header-height);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 44px;
		margin-right: auto;
		font-size: 1rem;
		font-stretch: var(--wide);
		font-weight: 650;
		letter-spacing: -0.01em;
		white-space: nowrap;
		color: var(--ink);
		text-decoration: none;
	}

	/* O mesmo ícone do perfil do Instagram, recortado em círculo como lá. */
	.brand img {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		box-shadow: 0 0 0 1px var(--line);
	}

	.main-nav {
		display: none;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.icon-link,
	.account {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		min-width: 44px;
		min-height: 44px;
		justify-content: center;
		padding: 0 8px;
		border-radius: 10px;
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--ink);
		text-decoration: none;
	}

	.icon-link:hover,
	.account:hover {
		background: var(--blush);
		color: var(--ink);
	}

	.icon-link :global(svg),
	.account :global(svg) {
		width: 20px;
		height: 20px;
	}

	.account[aria-current='page'] {
		background: var(--blush);
	}

	.cart {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-width: 44px;
		min-height: 44px;
		justify-content: center;
		padding: 0 12px;
		border-radius: 10px;
		background: var(--ink);
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--surface);
		text-decoration: none;
	}

	.cart:hover {
		background: var(--beni-deep);
		color: var(--surface);
	}

	.cart :global(svg) {
		width: 20px;
		height: 20px;
	}

	.count {
		min-width: 22px;
		padding: 0 6px;
		border-radius: 11px;
		background: var(--surface);
		font-size: 0.8125rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		line-height: 22px;
		text-align: center;
		color: var(--ink);
		animation: bump 0.3s ease-out;
	}

	@keyframes bump {
		from {
			transform: scale(1.4);
		}
	}

	.menu-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		padding: 0;
		border: none;
		border-radius: 10px;
		background: none;
		color: var(--ink);
		cursor: pointer;
	}

	.menu-button:hover {
		background: var(--blush);
	}

	.menu-button :global(svg) {
		width: 24px;
		height: 24px;
	}

	.wide-only {
		display: none;
	}

	/* Menu do celular: abre por cima da página, encostado na direita. */
	.menu {
		inset: 0 0 0 auto;
		width: min(100%, 380px);
		height: 100dvh;
		max-height: none;
		margin: 0;
		padding: 0 var(--gutter) 32px;
		border: none;
		background: var(--surface);
		color: var(--ink);
		overflow-y: auto;
	}

	.menu::backdrop {
		background: rgb(42 26 33 / 0.4);
	}

	.menu-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: var(--header-height);
	}

	.menu-title {
		font-stretch: var(--wide);
		font-weight: 650;
	}

	.menu ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.menu-main a {
		display: flex;
		align-items: center;
		min-height: 56px;
		border-bottom: 1px solid var(--line);
		font-size: 1.25rem;
		font-stretch: var(--wide);
		font-weight: 600;
		color: var(--ink);
		text-decoration: none;
	}

	.menu .menu-help {
		margin-top: 12px;
	}

	.menu-help a {
		display: flex;
		align-items: center;
		min-height: 44px;
		font-weight: 500;
		color: var(--ink);
	}

	.menu-account {
		display: grid;
		gap: 8px;
		justify-items: start;
		margin-top: 24px;
		padding: 18px;
		border-radius: var(--radius);
		background: var(--blush);
	}

	.menu-account p {
		font-size: 0.9375rem;
		color: var(--ink-soft);
	}

	.menu-account .btn {
		width: 100%;
	}

	.menu-instagram {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-top: 20px;
		font-size: 0.9375rem;
		color: var(--ink);
		text-decoration: none;
	}

	.menu-instagram :global(svg) {
		flex: none;
		width: 24px;
		height: 24px;
		color: var(--beni);
	}

	.menu-instagram strong {
		display: block;
		font-weight: 600;
		color: var(--beni);
	}

	@media (max-width: 379px) {
		.brand {
			font-size: 0.9375rem;
		}

		.brand img {
			width: 32px;
			height: 32px;
		}
	}

	@media (min-width: 960px) {
		.bar {
			gap: 20px;
		}

		.brand {
			margin-right: 0;
			font-size: 1.0625rem;
		}

		.main-nav {
			display: flex;
			gap: 2px;
			margin-right: auto;
		}

		.main-nav a {
			display: inline-flex;
			align-items: center;
			min-height: 44px;
			padding: 0 12px;
			border-radius: 10px;
			font-size: 0.9375rem;
			font-weight: 500;
			color: var(--ink);
			text-decoration: none;
		}

		.main-nav a:hover {
			background: var(--blush);
		}

		.main-nav a[aria-current='page'] {
			background: var(--blush);
			font-weight: 600;
		}

		.wide-only {
			display: inline-flex;
		}

		.cart {
			margin-left: 6px;
			padding: 0 16px;
		}

		.menu-button {
			display: none;
		}
	}
</style>
