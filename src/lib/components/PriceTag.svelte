<script lang="ts">
	import { formatBrl, formatJpy } from '#lib/format.ts';
	import type { PriceType } from '#lib/types.ts';

	type Props = {
		priceJpy: number;
		priceBrlCents: number;
		priceType: PriceType;
		size?: 'small' | 'large';
	};

	let { priceJpy, priceBrlCents, priceType, size = 'small' }: Props = $props();
</script>

<!-- Etiqueta de borda cheia: preço conferido na loja. Tracejada: preço de referência. -->
<p class="tag {priceType} {size}">
	<span class="jpy">{formatJpy(priceJpy)}</span>
	<span class="brl">
		<span aria-hidden="true">≈</span><span class="visually-hidden">aproximadamente</span>
		{formatBrl(priceBrlCents)}
	</span>
	{#if priceType === 'reference'}
		<span class="kind">preço de referência</span>
	{/if}
</p>

<style>
	.tag {
		display: inline-flex;
		flex-direction: column;
		padding: 6px 10px 7px;
		border: 1.5px solid var(--ink);
		border-top: none;
		background: var(--white);
		line-height: 1.2;
	}

	.reference {
		border-style: dashed;
	}

	.jpy {
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 700;
		white-space: nowrap;
	}

	.brl {
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--ink-soft);
		white-space: nowrap;
	}

	.kind {
		margin-top: 2px;
		font-size: 0.75rem;
		color: var(--ink-soft);
	}

	.large {
		padding: 10px 16px 12px;
	}

	.large .jpy {
		font-size: 2rem;
	}

	.large .brl {
		font-size: 1rem;
	}

	.large .kind {
		font-size: 0.875rem;
	}
</style>
