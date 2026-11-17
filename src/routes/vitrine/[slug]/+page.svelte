<script lang="ts">
	import Info from '@lucide/svelte/icons/info';
	import AddToCartButton from '#lib/components/AddToCartButton.svelte';
	import PriceTag from '#lib/components/PriceTag.svelte';
	import ProductGrid from '#lib/components/ProductGrid.svelte';
	import ProductImage from '#lib/components/ProductImage.svelte';
	import Seal from '#lib/components/Seal.svelte';
	import { resolve } from '$app/paths';
	import { STORE_NAME } from '#lib/config.ts';
	import { formatBrl, formatJpy, formatWeight, weightBandName } from '#lib/format.ts';
	import { vitrineHref } from '#lib/links.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const product = $derived(data.product);
	const estimate = $derived(data.estimate);
</script>

<svelte:head>
	<title>{product.name} · {STORE_NAME}</title>
	<meta name="description" content={product.description} />
</svelte:head>

<div class="wrap">
	<nav class="breadcrumb" aria-label="Você está em">
		<a href={resolve('/vitrine')}>Vitrine</a>
		<span aria-hidden="true">/</span>
		<a href={vitrineHref(product.categorySlug)}>{product.categoryName}</a>
	</nav>

	<article class="product">
		<div class="photo">
			<!-- A chave recria a foto ao trocar de produto: sem ela, uma foto que falhou no produto
			     anterior deixaria o substituto na tela. -->
			{#key product.slug}
				<ProductImage image={product.image} name={product.name} eager />
			{/key}
			{#if product.isLimitedEdition}
				<span class="limited">Edição limitada</span>
			{/if}
		</div>

		<div class="info">
			<h1>{product.name}</h1>
			<p class="description">{product.description}</p>

			<div class="price-block">
				<PriceTag
					priceJpy={product.priceJpy}
					priceBrlCents={product.priceBrlCents}
					priceType={product.priceType}
					size="large"
				/>
			</div>

			{#if product.priceType === 'store'}
				<p class="checked">
					<Seal size={40} />
					<span>
						<strong>Preço da etiqueta, conferido na loja.</strong>
						É o valor do caixa no Japão, já com imposto.
					</span>
				</p>
			{:else}
				<p class="checked reference">
					<Info aria-hidden="true" />
					<span>
						<strong>Preço de referência das lojas online do Japão.</strong>
						O valor exato é confirmado no orçamento, antes do pagamento.
					</span>
				</p>
			{/if}

			<div class="add">
				<AddToCartButton kind="product" slug={product.slug} />
			</div>

			<section class="estimate" aria-labelledby="estimativa-titulo">
				<h2 id="estimativa-titulo">Num pedido só com ele</h2>
				<dl>
					<div>
						<dt>Produto</dt>
						<dd class="price">{formatJpy(estimate.totals.productsJpy)}</dd>
					</div>
					<div>
						<dt>Frete interno e taxa de serviço</dt>
						<dd class="price">
							{formatJpy(estimate.charges.domesticShippingJpy + estimate.charges.serviceFeeJpy)}
						</dd>
					</div>
					<div>
						<dt>
							Frete EMS para {estimate.regionName}
							<span>caixa de até {formatWeight(estimate.totals.weightGrams)}</span>
						</dt>
						<dd class="price">
							{estimate.charges.internationalShippingJpy === null
								? 'a combinar'
								: formatJpy(estimate.charges.internationalShippingJpy)}
						</dd>
					</div>
					<div class="total">
						<dt>Total estimado</dt>
						<dd>
							<span class="price">{formatJpy(estimate.totals.totalJpy)}</span>
							<span class="brl">
								<span aria-hidden="true">≈</span><span class="visually-hidden">aproximadamente</span
								>
								{formatBrl(estimate.totals.totalBrlCents)}
							</span>
						</dd>
					</div>
				</dl>
				<p class="note">
					Frete e taxa são por pedido: com mais produtos na mesma caixa, eles se dividem entre
					todos. A região de entrega muda no <a href={resolve('/carrinho')}>carrinho</a>.
				</p>
			</section>

			<dl class="facts">
				<div>
					<dt>Sob encomenda</dt>
					<dd>
						Eu compro na loja depois do pagamento confirmado e envio pelo EMS, com código de
						rastreio.
					</dd>
				</div>
				<div>
					<dt>Faixa de peso: {weightBandName(product.weightGrams).toLowerCase()}</dt>
					<dd>
						Até {formatWeight(product.weightGrams)}. É a estimativa usada para somar o peso da caixa
						e calcular o frete.
					</dd>
				</div>
				<div>
					<dt>Antes de pedir</dt>
					<dd>
						Imposto de alfândega não está incluído e encomenda não tem troca por arrependimento.
						<a href={resolve('/como-funciona#avisos')}>Ver todos os avisos</a>
					</dd>
				</div>
			</dl>
		</div>
	</article>

	{#if data.related.length > 0}
		<section class="related" aria-labelledby="relacionados-titulo">
			<div class="heading">
				<h2 id="relacionados-titulo">Mais em {product.categoryName}</h2>
				<a class="text-link" href={vitrineHref(product.categorySlug)}>Ver tudo</a>
			</div>
			<ProductGrid products={data.related} />
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
		gap: 24px;
	}

	.photo {
		position: relative;
		overflow: hidden;
		border: 1px solid var(--line);
		border-radius: var(--radius-l);
	}

	.limited {
		position: absolute;
		top: 12px;
		left: 12px;
		padding: 4px 10px;
		border-radius: 6px;
		background: var(--beni);
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--surface);
	}

	h1 {
		font-size: clamp(1.5rem, 5.6vw, 2.125rem);
		line-height: 1.15;
	}

	.description {
		max-width: 56ch;
		margin-top: 10px;
		color: var(--ink-soft);
	}

	.price-block {
		margin-top: 20px;
	}

	.checked {
		display: flex;
		align-items: center;
		gap: 12px;
		max-width: 48ch;
		margin-top: 14px;
		font-size: 0.875rem;
		color: var(--ink-soft);
	}

	.checked strong {
		display: block;
		font-weight: 600;
		color: var(--ink);
	}

	.checked.reference {
		align-items: flex-start;
	}

	.checked.reference :global(svg) {
		flex: none;
		width: 20px;
		height: 20px;
		color: var(--beni);
	}

	.add {
		margin-top: 22px;
	}

	.estimate {
		margin-top: 28px;
		padding: 18px;
		border-radius: var(--radius);
		background: var(--blush);
	}

	.estimate h2 {
		font-size: 1rem;
		font-stretch: 100%;
		font-weight: 650;
		letter-spacing: 0;
	}

	.estimate dl {
		margin: 10px 0 0;
		font-variant-numeric: tabular-nums;
	}

	.estimate dl div {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
		padding: 5px 0;
		font-size: 0.9375rem;
	}

	.estimate dt span {
		display: block;
		font-size: 0.8125rem;
		color: var(--ink-soft);
	}

	.estimate dd {
		margin: 0;
		font-size: 1rem;
	}

	.estimate .total {
		margin-top: 6px;
		padding-top: 10px;
		border-top: 1.5px solid var(--ink);
		font-weight: 650;
	}

	.estimate .total dd {
		text-align: right;
	}

	.estimate .total .price {
		font-size: 1.375rem;
	}

	.brl {
		display: block;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--ink-soft);
	}

	.estimate .note {
		margin-top: 10px;
		font-size: 0.8125rem;
		color: var(--ink-soft);
	}

	.facts {
		margin: 28px 0 0;
		border-top: 1px solid var(--line);
	}

	.facts div {
		padding: 14px 0;
		border-bottom: 1px solid var(--line);
	}

	.facts dt {
		font-weight: 650;
	}

	.facts dd {
		margin: 4px 0 0;
		font-size: 0.9375rem;
		color: var(--ink-soft);
	}

	.related {
		margin-top: var(--section-gap);
	}

	.heading {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 4px 16px;
		margin-bottom: 20px;
	}

	.heading h2 {
		font-size: clamp(1.375rem, 4.6vw, 1.875rem);
	}

	/* Mostra só fileiras completas: o que sobraria fica escondido conforme o número de colunas. */
	.related :global(li:nth-child(n + 5)) {
		display: none;
	}

	@media (min-width: 640px) and (max-width: 959px) {
		.related :global(li:nth-child(4)) {
			display: none;
		}
	}

	@media (min-width: 900px) {
		.breadcrumb {
			margin-top: 20px;
		}

		.product {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			gap: 56px;
			align-items: start;
			margin-top: 8px;
		}

		.photo {
			position: sticky;
			top: calc(var(--header-height) + 24px);
		}

		.add {
			max-width: 400px;
		}
	}
</style>
