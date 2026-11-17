<script lang="ts">
	import type { ResolvedPathname } from '$app/types';
	import type { CategoryWithCount } from '#lib/types.ts';

	type Props = {
		categories: CategoryWithCount[];
		// Slug da categoria selecionada, null para "Todos" ou ausente quando nenhuma está ativa.
		active?: string | null;
		hrefFor: (categorySlug: string | null) => ResolvedPathname;
		// Na vitrine, trocar de categoria mantém a rolagem e o foco onde estão.
		keepScroll?: boolean;
	};

	let { categories, active, hrefFor, keepScroll = false }: Props = $props();

	const total = $derived(categories.reduce((sum, category) => sum + category.productCount, 0));
</script>

<nav class="tabs" aria-label="Categorias">
	<a
		href={hrefFor(null)}
		aria-current={active === null ? 'page' : undefined}
		data-sveltekit-reset={keepScroll ? false : undefined}
	>
		Todos <span class="count">{total}</span>
	</a>
	{#each categories as category (category.slug)}
		<a
			href={hrefFor(category.slug)}
			aria-current={active === category.slug ? 'page' : undefined}
			data-sveltekit-reset={keepScroll ? false : undefined}
		>
			{category.name} <span class="count">{category.productCount}</span>
		</a>
	{/each}
</nav>

<style>
	/* No celular a lista rola de lado e sai pela borda da tela, o que mostra que há mais categorias. */
	.tabs {
		display: flex;
		gap: 22px;
		margin: 0 calc(var(--gutter) * -1);
		padding: 0 var(--gutter);
		overflow-x: auto;
		scrollbar-width: none;
	}

	.tabs::-webkit-scrollbar {
		display: none;
	}

	a {
		flex: none;
		display: inline-flex;
		align-items: baseline;
		gap: 5px;
		min-height: 44px;
		padding: 10px 0 8px;
		border-bottom: 2px solid transparent;
		font-size: 0.9375rem;
		font-weight: 500;
		white-space: nowrap;
		color: var(--ink-soft);
		text-decoration: none;
	}

	a:hover {
		color: var(--ink);
	}

	a[aria-current='page'] {
		border-bottom-color: var(--beni);
		font-weight: 700;
		color: var(--ink);
	}

	.count {
		font-size: 0.75rem;
		font-weight: 500;
		font-variant-numeric: tabular-nums;
		color: var(--ink-soft);
	}

	@media (min-width: 640px) {
		.tabs {
			flex-wrap: wrap;
			gap: 0 26px;
			margin: 0;
			padding: 0;
			overflow: visible;
		}
	}
</style>
