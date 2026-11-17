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

<nav class="chips" aria-label="Categorias">
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
	.chips {
		display: flex;
		gap: 8px;
		margin: 0 calc(var(--gutter) * -1);
		padding: 2px var(--gutter);
		overflow-x: auto;
		scrollbar-width: none;
	}

	.chips::-webkit-scrollbar {
		display: none;
	}

	a {
		flex: none;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 40px;
		padding: 0 14px;
		border: 1px solid var(--line-strong);
		border-radius: 999px;
		background: var(--surface);
		font-size: 0.9375rem;
		font-weight: 500;
		white-space: nowrap;
		color: var(--ink);
		text-decoration: none;
	}

	a:hover {
		border-color: var(--ink-soft);
	}

	a[aria-current='page'] {
		border-color: var(--ink);
		background: var(--ink);
		color: var(--surface);
	}

	.count {
		font-size: 0.8125rem;
		font-variant-numeric: tabular-nums;
		color: var(--ink-soft);
	}

	a[aria-current='page'] .count {
		color: var(--blush-strong);
	}

	@media (min-width: 640px) {
		.chips {
			flex-wrap: wrap;
			margin: 0;
			padding: 0;
			overflow: visible;
		}
	}
</style>
