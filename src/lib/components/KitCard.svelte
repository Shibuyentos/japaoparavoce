<script lang="ts">
	import { formatBrl, formatJpy } from '#lib/format.ts';
	import { productHref } from '#lib/links.ts';
	import type { KitSummary } from '#lib/types.ts';
	import AddToCartButton from './AddToCartButton.svelte';
	import ProductImage from './ProductImage.svelte';

	let { kit }: { kit: KitSummary } = $props();
</script>

<article class="kit">
	<!-- A rotina de relance: os produtos na ordem de uso. -->
	<div class="photos" aria-hidden="true">
		{#each kit.steps as step (step.product.slug)}
			<ProductImage image={step.product.image} name={step.product.name} decorative />
		{/each}
	</div>

	<h3>{kit.name}</h3>
	<p class="description">{kit.description}</p>

	<ol>
		{#each kit.steps as step, index (step.product.slug)}
			<li>
				<span class="number" aria-hidden="true">{index + 1}</span>
				<div class="step">
					<span class="label">{step.label}</span>
					<a href={productHref(step.product.slug)}>{step.product.name}</a>
				</div>
				<span class="price">{formatJpy(step.product.priceJpy)}</span>
			</li>
		{/each}
	</ol>

	<div class="total">
		<span>Os {kit.steps.length} produtos</span>
		<span class="price">{formatJpy(kit.totalJpy)}</span>
	</div>
	<p class="note">
		<span aria-hidden="true">≈</span><span class="visually-hidden">aproximadamente</span>
		{formatBrl(kit.totalBrlCents)}. O frete é calculado no carrinho, com o resto do pedido.
	</p>
	<AddToCartButton kind="kit" slug={kit.slug} label="Adicionar o kit ao carrinho" />
</article>

<style>
	/* O position: relative prende ao cartão os textos escondidos (visually-hidden), que são
	   absolutos: sem ele, num carrossel eles escapariam da rolagem e alargariam a página. */
	.kit {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 18px;
		border: 1px solid var(--line);
		border-radius: var(--radius-l);
		background: var(--surface);
	}

	.photos {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 4px;
		margin: -4px -4px 14px;
	}

	.photos :global(.frame) {
		padding: 4%;
	}

	.photos :global(.placeholder span) {
		display: none;
	}

	h3 {
		font-size: 1.25rem;
		font-stretch: var(--wide);
		font-weight: 640;
		letter-spacing: -0.01em;
	}

	.description {
		margin-top: 6px;
		font-size: 0.9375rem;
		color: var(--ink-soft);
	}

	ol {
		flex: 1;
		margin: 14px 0 0;
		padding: 0;
		border-top: 1px solid var(--line);
		list-style: none;
	}

	li {
		display: grid;
		grid-template-columns: 18px 1fr auto;
		align-items: baseline;
		gap: 10px;
		padding: 9px 0;
		border-bottom: 1px solid var(--line);
	}

	.number {
		font-stretch: var(--narrow);
		font-weight: 700;
		color: var(--beni);
	}

	.step {
		min-width: 0;
	}

	.label {
		display: block;
		font-size: 0.8125rem;
		color: var(--ink-soft);
	}

	.step a {
		font-size: 0.9375rem;
		font-weight: 500;
		line-height: 1.35;
		color: var(--ink);
		text-decoration: none;
	}

	.step a:hover {
		text-decoration: underline;
	}

	li .price {
		font-size: 0.9375rem;
	}

	.total {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		margin-top: 14px;
		font-weight: 600;
	}

	.total .price {
		font-size: 1.5rem;
	}

	.note {
		margin: 2px 0 16px;
		font-size: 0.8125rem;
		color: var(--ink-soft);
	}
</style>
