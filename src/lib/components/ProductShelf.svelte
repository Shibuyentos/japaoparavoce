<script lang="ts">
	import { weightBandLabel } from '#lib/format.ts';
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

<!-- Cada fileira é uma prateleira: os produtos ficam em pé sobre a linha e a etiqueta de preço
     fica pendurada embaixo dela. -->
<ul class="shelf">
	{#each products as product, index (product.slug)}
		<li>
			<div class="photo">
				{#if product.isLimitedEdition}
					<span class="limited">Edição limitada</span>
				{/if}
				<ProductImage
					image={product.image}
					name={product.name}
					eager={index < eagerCount}
					decorative
				/>
			</div>
			<div class="edge">
				<div class="price">
					<PriceTag
						priceJpy={product.priceJpy}
						priceBrlCents={product.priceBrlCents}
						priceType={product.priceType}
					/>
					<div class="add">
						<AddToCartButton kind="product" slug={product.slug} iconOnlyFor={product.name} />
					</div>
				</div>
				<h3><a href={productHref(product.slug)}>{product.name}</a></h3>
				<p class="meta">frete {weightBandLabel(product.weightGrams)}</p>
			</div>
		</li>
	{/each}
</ul>

<style>
	.shelf {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		row-gap: 20px;
		/* No celular a prateleira vai de uma borda à outra da tela. */
		margin: 0 calc(var(--gutter) * -1);
		padding: 0;
		list-style: none;
	}

	@media (min-width: 640px) {
		.shelf {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			row-gap: 36px;
			margin: 0;
		}
	}

	@media (min-width: 900px) {
		.shelf {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	@media (min-width: 1200px) {
		.shelf {
			grid-template-columns: repeat(5, minmax(0, 1fr));
		}
	}

	li {
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.photo {
		position: relative;
		padding: 0 18px;
	}

	.limited {
		position: absolute;
		top: 4px;
		left: 12px;
		z-index: 1;
		padding: 3px 8px;
		background: var(--tag-yellow);
		font-size: 0.75rem;
		font-weight: 700;
		line-height: 1.3;
		color: var(--ink);
		transform: rotate(-3deg);
	}

	/* A borda de cima é a prateleira. Sem espaço entre as colunas, ela segue contínua na fileira. */
	.edge {
		flex: 1;
		padding: 0 12px;
		border-top: 2px solid var(--ink);
	}

	.price {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 8px;
	}

	/* Fica acima do link que cobre o produto inteiro, senão o toque no botão abriria o produto. */
	.add {
		position: relative;
		z-index: 1;
		flex: none;
	}

	h3 {
		margin-top: 8px;
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
	}

	h3 a:focus-visible {
		outline: none;
	}

	li:has(h3 a:focus-visible) {
		outline: 2px solid var(--ink);
		outline-offset: 2px;
	}

	.meta {
		margin-top: 2px;
		font-size: 0.8125rem;
		color: var(--ink-soft);
	}

	@media (min-width: 640px) {
		.photo {
			padding: 0 24px;
		}

		.edge {
			padding: 0 16px;
		}
	}
</style>
