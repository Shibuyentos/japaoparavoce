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

				<form method="POST" action="/admin/sair">
					<button><LogOut aria-hidden="true" />Sair</button>
				</form>
			</div>
		</header>
	{/if}

	<main>
		{@render children()}
	</main>

	{#if data.user}
		<footer class="wrap">
			<span>{STORE_NAME}: sessão de {data.user.name}</span>
			<a href={resolve('/')}>Ver a loja</a>
		</footer>
	{/if}
</div>

<style>
	/* O painel é ferramenta de trabalho: fundo branco e menos espaço que a loja. */
	.admin {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		min-height: 100dvh;
		background: var(--white);
	}

	header {
		position: sticky;
		top: 0;
		z-index: 10;
		border-bottom: 2px solid var(--ink);
		background: var(--white);
	}

	.bar {
		display: flex;
		align-items: center;
		gap: 4px;
		height: var(--header-height);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-right: 8px;
		font-family: var(--font-display);
		font-size: 1.0625rem;
		font-weight: 700;
		color: var(--ink);
		text-decoration: none;
	}

	nav {
		display: flex;
		align-self: stretch;
		margin-right: auto;
	}

	nav a {
		display: inline-flex;
		align-items: center;
		padding: 0 10px;
		border-bottom: 3px solid transparent;
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
		font-weight: 700;
		color: var(--ink);
	}

	button {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 40px;
		padding: 0 10px;
		border: none;
		background: none;
		font-family: inherit;
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--ink);
		cursor: pointer;
	}

	button:hover {
		text-decoration: underline;
	}

	button :global(svg) {
		width: 16px;
		height: 16px;
	}

	main {
		flex: 1;
		padding: 24px 0 56px;
	}

	footer {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 4px 16px;
		padding-top: 16px;
		padding-bottom: 24px;
		border-top: 1px solid var(--line);
		font-size: 0.875rem;
		color: var(--ink-soft);
	}

	@media (min-width: 860px) {
		main {
			padding-top: 36px;
		}
	}
</style>
