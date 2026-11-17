<script lang="ts">
	import { productHref } from '#lib/links.ts';
	import type { ProductSummary } from '#lib/types.ts';
	import AddToCartButton from './AddToCartButton.svelte';
	import PriceTag from './PriceTag.svelte';
	import ProductImage from './ProductImage.svelte';

	type Props = {
		products: ProductSummary[];
		// Quantas fotos do começo da lista carregam sem esperar a rolagem.
		eagerCount?: number;
	};

	let { products, eagerCount = 0 }: Props = $props();
</script>

<ul class="grid">
	{#each products as product, index (product.slug)}
		<li>
			<div class="photo">
				<ProductImage
					image={product.image}
					name={product.name}
					eager={index < eagerCount}
					decorative
				/>
				{#if product.isLimitedEdition}
					<span class="limited">Edição limitada</span>
				{/if}
			</div>
			<h3><a href={productHref(product.slug)}>{product.name}</a></h3>
			<div class="price-line">
				<PriceTag
					priceJpy={product.priceJpy}
					priceBrlCents={product.priceBrlCents}
					priceType={product.priceType}
				/>
			</div>
			<div class="add">
				<AddToCartButton kind="product" slug={product.slug} compactFor={product.name} />
			</div>
		</li>
	{/each}
</ul>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 28px 12px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.photo {
		position: relative;
		overflow: hidden;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		transition: border-color 0.15s ease;
	}

	li:hover .photo {
		border-color: var(--sakura);
	}

	.limited {
		position: absolute;
		top: 8px;
		left: 8px;
		padding: 3px 8px;
		border-radius: 6px;
		background: var(--beni);
		font-size: 0.75rem;
		font-weight: 600;
		line-height: 1.35;
		color: var(--surface);
	}

	h3 {
		margin-top: 12px;
		font-size: 0.9375rem;
		font-weight: 500;
		line-height: 1.35;
		text-wrap: pretty;
	}

	h3 a {
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		color: var(--ink);
		text-decoration: none;
	}

	/* O link do nome cobre o produto inteiro, então qualquer toque abre a página dele. */
	h3 a::after {
		content: '';
		position: absolute;
		inset: 0;
	}

	li:hover h3 a {
		text-decoration: underline;
		text-decoration-color: var(--sakura);
	}

	h3 a:focus-visible {
		outline: none;
	}

	li:has(h3 a:focus-visible) .photo {
		outline: 2.5px solid var(--beni);
		outline-offset: 2px;
	}

	/* O preço e o botão descem para a base: numa fileira, todos ficam na mesma altura. */
	.price-line {
		flex: 1;
		margin-top: 6px;
	}

	/* Fica acima do link que cobre o produto inteiro, senão o toque no botão abriria o produto. */
	.add {
		position: relative;
		z-index: 1;
		margin-top: 12px;
	}

	@media (min-width: 640px) {
		.grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 36px 20px;
		}
	}

	@media (min-width: 960px) {
		.grid {
			grid-template-columns: repeat(4, minmax(0, 1fr));
			gap: 40px 24px;
		}
	}
</style>
