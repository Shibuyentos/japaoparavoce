<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import InstagramIcon from '#lib/components/InstagramIcon.svelte';
	import LimitedBadge from '#lib/components/LimitedBadge.svelte';
	import ProductImage from '#lib/components/ProductImage.svelte';
	import ProductPrice from '#lib/components/ProductPrice.svelte';
	import WeightChip from '#lib/components/WeightChip.svelte';
	import { resolve } from '$app/paths';
	import { INSTAGRAM_URL, STORE_NAME } from '#lib/config.ts';
	import { vitrineHref } from '#lib/links.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const product = $derived(data.product);
</script>

<svelte:head>
	<title>{product.name} · {STORE_NAME}</title>
	<meta name="description" content={product.description} />
</svelte:head>

<section>
	<div class="wrap">
		<nav class="breadcrumb" aria-label="Você está em">
			<a href={resolve('/vitrine')}>Vitrine</a>
			<span aria-hidden="true">/</span>
			<a href={vitrineHref(product.categorySlug)}>{product.categoryName}</a>
		</nav>

		<div class="product">
			<div class="photo">
				{#if product.isLimitedEdition}
					<LimitedBadge />
				{/if}
				<ProductImage image={product.image} name={product.name} eager />
			</div>

			<div class="info">
				<h1>{product.name}</h1>
				<p class="description">{product.description}</p>
				<WeightChip grams={product.weightGrams} />
				<ProductPrice
					priceJpy={product.priceJpy}
					priceBrlCents={product.priceBrlCents}
					priceType={product.priceType}
					size="large"
				/>
				<p class="order-note">
					Produto <strong>sob encomenda</strong>: eu compro na loja do Japão depois do pagamento
					confirmado e envio com rastreio. Frete e taxa de serviço são somados no orçamento.
				</p>
				<div class="actions">
					<a class="btn btn-primary" href={INSTAGRAM_URL} target="_blank" rel="external noopener">
						<InstagramIcon />
						Pedir pelo Instagram
					</a>
					<a class="btn btn-ghost" href={resolve('/vitrine')}>
						<ArrowLeft />
						Voltar para a vitrine
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	section {
		padding-top: 28px;
	}

	.breadcrumb {
		display: flex;
		gap: 8px;
		font-size: 15px;
		font-weight: 700;
		color: var(--muted);
	}

	.breadcrumb a {
		text-decoration: none;
	}

	.product {
		display: grid;
		gap: 28px;
		margin-top: 20px;
	}

	@media (min-width: 860px) {
		.product {
			grid-template-columns: 0.9fr 1.1fr;
			gap: 44px;
			align-items: start;
		}
	}

	.photo {
		position: relative;
		border: 1px solid #f6d3e0;
		border-radius: var(--radius);
		box-shadow: var(--shadow-card);
		overflow: hidden;
		max-width: 520px;
	}

	.photo :global(.limited) {
		top: 14px;
		right: 14px;
		width: 88px;
		height: 88px;
		font-size: 12.5px;
	}

	.info {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	h1 {
		font-size: clamp(26px, 5vw, 34px);
		font-weight: 800;
		color: var(--ink-strong);
	}

	.description {
		margin: 0;
		color: var(--muted);
		font-size: 17px;
	}

	.order-note {
		margin: 0;
		background: var(--pink-bg);
		border: 1.5px solid var(--line);
		border-radius: 14px;
		padding: 14px 16px;
		font-size: 15px;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 6px;
	}
</style>
