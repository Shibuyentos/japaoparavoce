<script lang="ts">
	import AddToCartButton from '#lib/components/AddToCartButton.svelte';
	import PriceTag from '#lib/components/PriceTag.svelte';
	import ProductImage from '#lib/components/ProductImage.svelte';
	import ProductShelf from '#lib/components/ProductShelf.svelte';
	import { resolve } from '$app/paths';
	import { STORE_NAME } from '#lib/config.ts';
	import { formatJpy, weightBandLabel, weightBandName } from '#lib/format.ts';
	import { vitrineHref } from '#lib/links.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const product = $derived(data.product);
</script>

<svelte:head>
	<title>{product.name} · {STORE_NAME}</title>
	<meta name="description" content={product.description} />
</svelte:head>

<div class="wrap wrap-wide">
	<nav class="breadcrumb" aria-label="Você está em">
		<a href={resolve('/vitrine')}>Vitrine</a>
		<span aria-hidden="true">/</span>
		<a href={vitrineHref(product.categorySlug)}>{product.categoryName}</a>
	</nav>

	<article class="product">
		<div class="photo">
			{#if product.isLimitedEdition}
				<span class="limited">Edição limitada</span>
			{/if}
			<!-- A chave recria a foto ao trocar de produto: sem ela, uma foto que falhou no produto
			     anterior deixaria o substituto na tela. -->
			{#key product.slug}
				<ProductImage image={product.image} name={product.name} eager />
			{/key}
		</div>

		<div class="info">
			<h1>{product.name}</h1>
			<p class="description">{product.description}</p>

			<div class="price">
				<PriceTag
					priceJpy={product.priceJpy}
					priceBrlCents={product.priceBrlCents}
					priceType={product.priceType}
					size="large"
				/>
			</div>
			<p class="price-note">
				{#if product.priceType === 'store'}
					Preço da etiqueta da loja, já com imposto: é o valor do caixa.
				{:else}
					Preço de referência das lojas online do Japão. O valor exato é confirmado no orçamento,
					antes do pagamento.
				{/if}
				O valor em reais usa um câmbio aproximado.
			</p>

			<div class="add">
				<AddToCartButton kind="product" slug={product.slug} />
			</div>

			<dl>
				<div>
					<dt>Sob encomenda</dt>
					<dd>
						Compro na loja do Japão depois do pagamento confirmado e envio com código de rastreio.
					</dd>
				</div>
				<div>
					<dt>Faixa de frete</dt>
					<dd>
						{weightBandName(product.weightGrams)}, {weightBandLabel(product.weightGrams)}. É uma
						estimativa: o frete internacional é calculado pelo peso da caixa inteira.
					</dd>
				</div>
				<div>
					<dt>Somado ao pedido</dt>
					<dd>
						Frete interno no Japão ({formatJpy(data.fees.domesticShippingJpy)}) e taxa de serviço ({formatJpy(
							data.fees.serviceFeeJpy
						)}), uma vez por pedido.
						<a href={resolve('/#valores')}>Ver como o valor é formado</a>
					</dd>
				</div>
			</dl>
		</div>
	</article>

	{#if data.related.length > 0}
		<section class="related">
			<h2>Na mesma prateleira</h2>
			<ProductShelf products={data.related} />
			<a class="more" href={vitrineHref(product.categorySlug)}>
				Ver tudo de {product.categoryName}
			</a>
		</section>
	{/if}
</div>

<style>
	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: 44px;
		margin-top: 8px;
		font-size: 0.875rem;
		color: var(--ink-soft);
	}

	.breadcrumb a {
		color: var(--ink-soft);
	}

	.product {
		display: grid;
		gap: 0;
	}

	/* Como na vitrine, o produto fica em pé sobre a linha e a etiqueta de preço pende dela. */
	.photo {
		position: relative;
		margin: 0 calc(var(--gutter) * -1);
		padding: 0 56px;
		border-bottom: 2px solid var(--ink);
	}

	.limited {
		position: absolute;
		top: 8px;
		left: var(--gutter);
		z-index: 1;
		padding: 4px 10px;
		background: var(--tag-yellow);
		font-size: 0.875rem;
		font-weight: 700;
		transform: rotate(-3deg);
	}

	/* No celular a etiqueta pende da prateleira da foto, antes do nome, como na vitrine. */
	.info {
		display: flex;
		flex-direction: column;
	}

	.price {
		order: -1;
	}

	h1 {
		margin-top: 18px;
		font-size: clamp(1.5rem, 5.6vw, 2.125rem);
		line-height: 1.18;
	}

	.description {
		margin-top: 10px;
		max-width: 56ch;
		color: var(--ink-soft);
	}

	.price-note {
		max-width: 52ch;
		margin-top: 12px;
		font-size: 0.875rem;
		color: var(--ink-soft);
	}

	.add {
		margin-top: 20px;
	}

	dl {
		margin: 28px 0 0;
		border-bottom: 1px solid var(--line);
	}

	dl div {
		padding: 12px 0;
		border-top: 1px solid var(--line);
	}

	dt {
		font-weight: 700;
	}

	dd {
		margin: 2px 0 0;
		font-size: 0.9375rem;
		color: var(--ink-soft);
	}

	.related {
		margin-top: 64px;
	}

	.related h2 {
		margin-bottom: 20px;
		font-size: clamp(1.5rem, 4.6vw, 1.875rem);
	}

	/* Mostra uma fileira completa: o que sobraria fica escondido conforme o número de colunas. */
	.related :global(li:nth-child(n + 5)) {
		display: none;
	}

	@media (min-width: 640px) and (max-width: 899px) {
		.related :global(li:nth-child(4)) {
			display: none;
		}
	}

	@media (min-width: 1200px) {
		.related :global(li:nth-child(5)) {
			display: flex;
		}
	}

	.more {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		margin-top: 24px;
		font-weight: 700;
	}

	@media (min-width: 860px) {
		.breadcrumb {
			margin-top: 20px;
		}

		.product {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
			gap: 64px;
			align-items: start;
			margin-top: 8px;
		}

		.photo {
			position: sticky;
			top: calc(var(--header-height) + 24px);
			margin: 0;
			padding: 0 48px;
		}

		.limited {
			left: 0;
		}

		h1 {
			margin-top: 0;
		}

		.price {
			order: 0;
			margin-top: 24px;
			border-top: 2px solid var(--ink);
		}

		.add {
			max-width: 360px;
		}

		.related {
			margin-top: 104px;
		}
	}
</style>
