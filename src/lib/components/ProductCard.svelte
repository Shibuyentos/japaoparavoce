<script lang="ts">
	import { productHref } from '#lib/links.ts';
	import type { ProductSummary } from '#lib/types.ts';
	import LimitedBadge from './LimitedBadge.svelte';
	import ProductImage from './ProductImage.svelte';
	import ProductPrice from './ProductPrice.svelte';
	import WeightChip from './WeightChip.svelte';

	let { product, eager = false }: { product: ProductSummary; eager?: boolean } = $props();
</script>

<article class="card">
	{#if product.isLimitedEdition}
		<LimitedBadge />
	{/if}
	<ProductImage image={product.image} name={product.name} {eager} />
	<div class="body">
		<h3><a href={productHref(product.slug)}>{product.name}</a></h3>
		<p class="description">{product.description}</p>
		<WeightChip grams={product.weightGrams} />
		<ProductPrice
			priceJpy={product.priceJpy}
			priceBrlCents={product.priceBrlCents}
			priceType={product.priceType}
		/>
	</div>
</article>

<style>
	.card {
		position: relative;
		background: var(--surface);
		border: 1px solid #f6d3e0;
		border-radius: 16px;
		box-shadow: var(--shadow-card);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		transition: border-color 0.15s ease;
	}

	.card:hover {
		border-color: var(--pink);
	}

	.card :global(img),
	.card :global(.placeholder) {
		border-bottom: 1px solid var(--line-soft);
	}

	.body {
		padding: 10px 12px 12px;
		display: flex;
		flex-direction: column;
		gap: 7px;
		flex: 1;
	}

	h3 {
		font-size: 15.5px;
		line-height: 1.35;
		color: var(--ink-strong);
	}

	h3 a {
		color: inherit;
		text-decoration: none;
	}

	/* O link do nome cobre o cartão inteiro, então qualquer clique abre o produto. */
	h3 a::after {
		content: '';
		position: absolute;
		inset: 0;
	}

	.description {
		margin: 0;
		color: var(--muted);
		font-size: 13.5px;
		line-height: 1.45;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.body :global(.price) {
		margin-top: auto;
	}

	@media (max-width: 480px) {
		.body {
			padding: 8px 9px 10px;
		}

		h3 {
			font-size: 14.5px;
		}
	}
</style>
