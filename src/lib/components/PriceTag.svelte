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

<p class="tag {size}">
	<span class="jpy price">{formatJpy(priceJpy)}</span>
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
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0 8px;
		line-height: 1.2;
	}

	.jpy {
		font-size: 1.3125rem;
		color: var(--ink);
	}

	.brl {
		font-size: 0.875rem;
		font-weight: 500;
		white-space: nowrap;
		color: var(--ink-soft);
	}

	.kind {
		flex-basis: 100%;
		margin-top: 2px;
		font-size: 0.8125rem;
		color: var(--ink-soft);
	}

	.large .jpy {
		font-size: clamp(2.25rem, 9vw, 2.75rem);
	}

	.large .brl {
		font-size: 1.0625rem;
	}

	.large .kind {
		font-size: 0.9375rem;
	}
</style>
