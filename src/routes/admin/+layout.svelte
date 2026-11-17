<script lang="ts">
	import LogOut from '@lucide/svelte/icons/log-out';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { STORE_NAME } from '#lib/config.ts';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	// "Hoje" é a raiz do painel, então só fica marcado no endereço exato dele.
	const links = [
		{ href: resolve('/admin'), label: 'Hoje', exact: true },
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

<div class="admin">
	<!-- Na tela de login ainda não há usuário, então a barra do painel não aparece. -->
	{#if data.user}
		<header>
			<div class="wrap bar">
				<a class="brand" href={resolve('/admin')}>
					<img src="/images/site/icone-192.webp" alt="" width="32" height="32" />
					Painel
				</a>

				<nav aria-label="Painel">
					{#each links as link (link.href)}
						<a href={link.href} aria-current={isCurrent(link) ? 'page' : undefined}>
							{link.label}
						</a>
					{/each}
				</nav>

				<div class="end">
					<a class="store-link" href={resolve('/')}>Ver a loja</a>
					<form method="POST" action="/sair">
						<button aria-label="Sair do painel"><LogOut aria-hidden="true" /></button>
					</form>
				</div>
			</div>
		</header>
	{/if}

	<main>
		{@render children()}
	</main>

	{#if data.user}
		<footer class="wrap">{STORE_NAME}: sessão de {data.user.name}</footer>
	{/if}
</div>

<style>
	/* O painel é ferramenta de trabalho: fundo neutro, blocos brancos e menos espaço que a loja. */
	.admin {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		min-height: 100dvh;
		background: #f6f2f3;
	}

	header {
		position: sticky;
		top: 0;
		z-index: 10;
		border-bottom: 1px solid var(--line);
		background: var(--surface);
	}

	.bar {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-areas:
			'brand end'
			'nav nav';
		align-items: center;
		column-gap: 12px;
	}

	.brand {
		grid-area: brand;
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 52px;
		font-stretch: var(--wide);
		font-weight: 650;
		color: var(--ink);
		text-decoration: none;
	}

	.brand img {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		box-shadow: 0 0 0 1px var(--line);
	}

	nav {
		grid-area: nav;
		display: flex;
		gap: 4px;
		margin: 0 calc(var(--gutter) * -1);
		padding: 0 var(--gutter);
		border-top: 1px solid var(--line);
	}

	nav a {
		flex: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 46px;
		border-bottom: 2.5px solid transparent;
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--ink-soft);
		text-decoration: none;
	}

	nav a:hover {
		color: var(--ink);
	}

	nav a[aria-current='page'] {
		border-bottom-color: var(--beni);
		font-weight: 650;
		color: var(--ink);
	}

	.end {
		grid-area: end;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 4px;
	}

	.store-link {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 0 10px;
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--ink);
	}

	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border: none;
		border-radius: 10px;
		background: none;
		color: var(--ink);
		cursor: pointer;
	}

	button:hover {
		background: var(--blush);
	}

	button :global(svg) {
		width: 19px;
		height: 19px;
	}

	main {
		flex: 1;
		padding: 24px 0 56px;
	}

	footer {
		padding-top: 16px;
		padding-bottom: 24px;
		border-top: 1px solid var(--line);
		font-size: 0.875rem;
		color: var(--ink-soft);
	}

	@media (min-width: 760px) {
		.bar {
			grid-template-columns: auto 1fr auto;
			grid-template-areas: 'brand nav end';
			column-gap: 28px;
		}

		.brand {
			min-height: 60px;
		}

		nav {
			align-self: stretch;
			margin: 0;
			padding: 0;
			border-top: none;
		}

		nav a {
			flex: none;
			padding: 0 12px;
		}

		main {
			padding-top: 36px;
		}
	}
</style>
