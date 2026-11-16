<script lang="ts">
	import LogOut from '@lucide/svelte/icons/log-out';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	// "Minha conta" é a raiz da área, então só fica marcada no endereço exato dela.
	const links = [
		{ href: resolve('/conta'), label: 'Minha conta', exact: true },
		{ href: resolve('/conta/pedidos'), label: 'Meus pedidos', exact: false }
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
			<button><LogOut />Sair</button>
		</form>
	</div>

	{@render children()}
</div>

<style>
	.account {
		padding-top: 28px;
		padding-bottom: 60px;
	}

	.bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		margin-bottom: 24px;
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	nav a,
	button {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 14px;
		border: 1.5px solid var(--line);
		border-radius: 999px;
		background: var(--surface);
		font-family: inherit;
		font-size: 15px;
		font-weight: 700;
		color: var(--ink);
		text-decoration: none;
		cursor: pointer;
	}

	nav a:hover,
	button:hover {
		border-color: var(--pink);
		color: var(--pink-dark);
	}

	nav a[aria-current='page'] {
		background: var(--pink);
		border-color: var(--pink);
		color: #ffffff;
	}

	button :global(svg) {
		width: 16px;
		height: 16px;
	}
</style>
