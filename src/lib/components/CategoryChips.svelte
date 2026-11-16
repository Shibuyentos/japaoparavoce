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
	.chips {
		display: flex;
		gap: 8px;
		overflow-x: auto;
		max-width: 100%;
		padding: 2px 2px 8px;
		scrollbar-width: thin;
	}

	a {
		flex: 0 0 auto;
		white-space: nowrap;
		text-decoration: none;
		font-size: 14.5px;
		font-weight: 800;
		color: var(--pink-dark);
		background: #ffffff;
		border: 2px solid var(--pink-input);
		border-radius: 999px;
		padding: 8px 15px;
		display: inline-flex;
		align-items: center;
		gap: 7px;
	}

	a:hover {
		background: var(--chip-bg);
	}

	.count {
		font-size: 12.5px;
		background: var(--chip-bg);
		border-radius: 999px;
		padding: 1px 8px;
	}

	a[aria-current='page'] {
		background: var(--pink);
		border-color: var(--pink);
		color: #ffffff;
		box-shadow: 0 6px 16px rgba(236, 127, 168, 0.3);
	}

	a[aria-current='page'] .count {
		background: rgba(255, 255, 255, 0.28);
	}
</style>
