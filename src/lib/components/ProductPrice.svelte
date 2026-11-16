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

	// Nos cartões da vitrine a nota é curta; na página do produto aparece a explicação completa.
	const notes: Record<PriceType, Record<'small' | 'large', string>> = {
		store: {
			small: 'Preço da loja, com imposto.',
			large: 'Preço da loja, já com imposto — é o valor do caixa. Câmbio aproximado.'
		},
		reference: {
			small: 'Preço de referência, confirmado no orçamento.',
			large:
				'Preço de referência no Japão — o valor exato é confirmado no orçamento. Câmbio aproximado.'
		}
	};
</script>

<p class="price {size}">
	<strong>{formatJpy(priceJpy)}</strong> · ≈ {formatBrl(priceBrlCents)}
	<span class="note">{notes[priceType][size]}</span>
</p>

<style>
	.price {
		margin: 0;
		background: #fff5f9;
		border: 1px solid #ffe0ee;
		border-radius: 10px;
		padding: 7px 10px;
		color: var(--pink-dark);
		font-weight: 700;
		font-size: 15px;
	}

	strong {
		color: #241218;
		font-size: 21px;
		letter-spacing: -0.01em;
	}

	.note {
		display: block;
		font-size: 12px;
		font-weight: 500;
		line-height: 1.45;
		color: var(--muted);
	}

	.large {
		padding: 14px 16px;
		font-size: 18px;
	}

	.large strong {
		font-size: 30px;
	}

	.large .note {
		font-size: 14px;
		margin-top: 4px;
	}

	@media (max-width: 480px) {
		.small strong {
			font-size: 19px;
		}
	}
</style>
