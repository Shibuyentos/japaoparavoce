<script lang="ts">
	import { formatBrl, formatJpy } from '#lib/format.ts';
	import { productHref } from '#lib/links.ts';
	import type { KitSummary } from '#lib/types.ts';
	import AddToCartButton from './AddToCartButton.svelte';
	import ProductImage from './ProductImage.svelte';

	let { kit }: { kit: KitSummary } = $props();
</script>

<article class="kit">
	<h3>{kit.name}</h3>
	<p class="description">{kit.description}</p>

	<!-- A rotina de relance: os produtos na ordem de uso, em pé na mesma prateleira. -->
	<div class="shelf" aria-hidden="true">
		{#each kit.steps as step (step.product.slug)}
			<ProductImage image={step.product.image} name={step.product.name} decorative />
		{/each}
	</div>

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

	<p class="total">
		<span>Total do kit</span>
		<strong>{formatJpy(kit.totalJpy)}</strong>
	</p>
	<p class="note">
		<span aria-hidden="true">≈</span><span class="visually-hidden">aproximadamente</span>
		{formatBrl(kit.totalBrlCents)}. É a soma dos produtos; o frete é calculado no seu pedido.
	</p>
	<AddToCartButton kind="kit" slug={kit.slug} label="Adicionar o kit ao pedido" />
</article>

<style>
	.kit {
		display: flex;
		flex-direction: column;
	}

	h3 {
		font-family: var(--font-display);
		font-size: 1.375rem;
	}

	.description {
		margin-top: 6px;
		font-size: 0.9375rem;
		color: var(--ink-soft);
	}

	.shelf {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 6px;
		margin-top: 14px;
		padding: 0 4px;
		border-bottom: 2px solid var(--ink);
	}

	.shelf :global(.placeholder span) {
		display: none;
	}

	ol {
		flex: 1;
		margin: 0;
		padding: 0;
		list-style: none;
		font-variant-numeric: tabular-nums;
	}

	li {
		display: grid;
		grid-template-columns: 20px 1fr auto;
		align-items: baseline;
		gap: 8px;
		padding: 7px 0;
		border-bottom: 1px solid var(--line);
	}

	.number {
		font-family: var(--font-display);
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

	.price {
		font-size: 0.9375rem;
		font-weight: 700;
		white-space: nowrap;
	}

	.total {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		margin-top: 12px;
		font-weight: 700;
	}

	.total strong {
		font-family: var(--font-display);
		font-size: 1.375rem;
	}

	.note {
		margin: 2px 0 14px;
		font-size: 0.8125rem;
		color: var(--ink-soft);
	}
</style>
