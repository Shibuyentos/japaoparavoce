<script lang="ts">
	import LogOut from '@lucide/svelte/icons/log-out';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { STORE_NAME } from '#lib/config.ts';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	// "Resumo" é a raiz do painel, então só fica marcado no endereço exato dele.
	const links = [
		{ href: resolve('/admin'), label: 'Resumo', exact: true },
		{ href: resolve('/admin/pedidos'), label: 'Pedidos', exact: false }
	];

	function isCurrent(link: (typeof links)[number]): boolean {
		const { pathname } = page.url;
		return link.exact ? pathname === link.href : pathname.startsWith(link.href);
	}
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<!-- Na tela de login ainda não há usuário, então a barra do painel não aparece. -->
{#if data.user}
	<header>
		<div class="wrap bar">
			<a class="brand" href={resolve('/admin')}>
				<img src="/images/site/logo.webp" alt="" width="36" height="36" />
				<span>Painel <span class="store">· {STORE_NAME}</span></span>
			</a>

			<nav aria-label="Painel">
				{#each links as link (link.href)}
					<a href={link.href} aria-current={isCurrent(link) ? 'page' : undefined}>
						{link.label}
					</a>
				{/each}
				<a href={resolve('/')}>Ver a loja</a>
			</nav>

			<form method="POST" action="/sair">
				<span class="user">{data.user.name}</span>
				<button aria-label="Sair do painel"><LogOut />Sair</button>
			</form>
		</div>
	</header>
{/if}

<main>
	{@render children()}
</main>

<style>
	header {
		border-bottom: 1px solid var(--line);
		background: var(--pink-bg);
	}

	.bar {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 6px 18px;
		min-height: 60px;
		padding-top: 8px;
		padding-bottom: 8px;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		font-weight: 800;
		color: var(--ink);
		text-decoration: none;
	}

	.brand img {
		border-radius: 10px;
	}

	.store {
		font-weight: 500;
		color: var(--muted);
	}

	nav {
		display: flex;
		gap: 4px;
		margin-right: auto;
	}

	nav a {
		padding: 6px 12px;
		border-radius: 999px;
		font-size: 15.5px;
		font-weight: 700;
		color: var(--ink);
		text-decoration: none;
	}

	nav a:hover,
	nav a[aria-current='page'] {
		background: var(--surface);
		color: var(--pink-dark);
	}

	form {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.user {
		font-size: 14.5px;
		color: var(--muted);
	}

	button {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 12px;
		border: 1.5px solid var(--line);
		border-radius: 999px;
		background: var(--surface);
		font-family: inherit;
		font-size: 14.5px;
		font-weight: 700;
		color: var(--ink);
		cursor: pointer;
	}

	button:hover {
		border-color: var(--pink);
		color: var(--pink-dark);
	}

	button :global(svg) {
		width: 16px;
		height: 16px;
	}

	main {
		padding: 28px 0 60px;
	}

	@media (max-width: 639px) {
		.store,
		.user {
			display: none;
		}

		/* No celular o botão de sair sobe para a linha do logo e o menu ocupa a linha de baixo. */
		nav {
			order: 1;
			flex-basis: 100%;
		}

		form {
			margin-left: auto;
		}
	}
</style>
