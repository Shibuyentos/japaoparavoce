<script lang="ts">
	import { formatBrl, formatJpy } from '#lib/format.ts';
	import { productHref } from '#lib/links.ts';
	import type { KitSummary } from '#lib/types.ts';
	import AddToCartButton from './AddToCartButton.svelte';
	import ProductThumb from './ProductThumb.svelte';

	let { kit }: { kit: KitSummary } = $props();
</script>

<article class="kit">
	<h3>{kit.name}</h3>
	<p class="description">{kit.description}</p>

	<ol>
		{#each kit.steps as step, index (step.product.slug)}
			<li>
				<span class="number" aria-hidden="true">{index + 1}</span>
				<ProductThumb image={step.product.image} name={step.product.name} />
				<div class="step-info">
					<span class="label">{step.label}</span>
					<a href={productHref(step.product.slug)}>{step.product.name}</a>
					<span class="price">
						{formatJpy(step.product.priceJpy)} · ≈ {formatBrl(step.product.priceBrlCents)}
					</span>
				</div>
			</li>
		{/each}
	</ol>

	<p class="total">Total do kit: {formatJpy(kit.totalJpy)} · ≈ {formatBrl(kit.totalBrlCents)}</p>
	<p class="note">O total é a soma dos produtos acima. O frete é calculado no seu pedido.</p>
	<AddToCartButton kind="kit" slug={kit.slug} label="Adicionar kit ao pedido" />
</article>

<style>
	.kit {
		background: var(--surface);
		border: 1px solid #f6d3e0;
		border-radius: 22px;
		box-shadow: var(--shadow-card);
		padding: 20px 18px 22px;
		display: flex;
		flex-direction: column;
		gap: 11px;
	}

	h3 {
		color: var(--pink-title);
		font-size: 21px;
	}

	.description {
		margin: 0;
		font-size: 15.5px;
		color: var(--muted);
	}

	ol {
		list-style: none;
		margin: 2px 0 0;
		padding: 0;
	}

	li {
		display: flex;
		align-items: center;
		gap: 11px;
		padding: 9px 0;
		border-bottom: 1px dashed var(--line);
	}

	li:last-child {
		border-bottom: none;
		padding-bottom: 2px;
	}

	.number {
		flex: none;
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background: radial-gradient(circle at 32% 28%, #ffedb0, #eec25e 52%, #c08c1d);
		color: #5e4300;
		font-weight: 800;
		font-size: 14px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 3px 8px rgba(160, 110, 10, 0.3);
	}

	.step-info {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.label {
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--pink-dark);
	}

	.step-info a {
		font-size: 14.5px;
		font-weight: 700;
		color: var(--ink-strong);
		line-height: 1.35;
		text-decoration: none;
	}

	.step-info a:hover {
		color: var(--pink-dark);
		text-decoration: underline;
	}

	.price {
		font-size: 13.5px;
		color: var(--muted);
	}

	.total {
		margin: 4px 0 0;
		padding-top: 13px;
		border-top: 2px solid #ffe0ee;
		font-size: 19px;
		font-weight: 800;
		color: var(--pink-dark);
	}

	.note {
		margin: 0;
		font-size: 13.5px;
		color: var(--muted);
	}
</style>
