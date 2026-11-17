<script lang="ts">
	import LogOut from '@lucide/svelte/icons/log-out';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	// "Minha conta" é a raiz da área, então só fica marcada no endereço exato dela.
	const links = [
		{ href: resolve('/conta/pedidos'), label: 'Meus pedidos', exact: false },
		{ href: resolve('/conta'), label: 'Minha conta', exact: true }
	];

	function isCurrent(link: (typeof links)[number]): boolean {
		const { pathname } = page.url;
		return link.exact ? pathname === link.href : pathname.startsWith(link.href);
	}
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="wrap account">
	<div class="bar">
		<nav aria-label="Minha conta">
			{#each links as link (link.href)}
				<a href={link.href} aria-current={isCurrent(link) ? 'page' : undefined}>{link.label}</a>
			{/each}
		</nav>

		<form method="POST" action="/sair">
			<button><LogOut aria-hidden="true" />Sair</button>
		</form>
	</div>

	{@render children()}
</div>

<style>
	.account {
		padding-top: 16px;
	}

	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		margin-bottom: 28px;
		border-bottom: 1px solid var(--line);
	}

	nav {
		display: flex;
		gap: 20px;
	}

	nav a {
		display: inline-flex;
		align-items: center;
		min-height: 48px;
		border-bottom: 2px solid transparent;
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

	button {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 44px;
		padding: 0 4px;
		border: none;
		background: none;
		font-family: inherit;
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--ink-soft);
		cursor: pointer;
	}

	button:hover {
		color: var(--ink);
		text-decoration: underline;
	}

	button :global(svg) {
		width: 16px;
		height: 16px;
	}

	@media (min-width: 960px) {
		.account {
			padding-top: 32px;
		}
	}
</style>
