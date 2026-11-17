<script lang="ts">
	import { countLabel, formatBrl, formatJpy, formatWeight } from '#lib/format.ts';
	import type { OrderCharges, OrderLine, OrderTotals } from '#lib/types.ts';
	import Receipt from './Receipt.svelte';

	type Props = {
		charges: OrderCharges;
		totals: OrderTotals;
		// Com os itens, a nota lista cada produto antes das taxas. Sem eles, mostra só a soma.
		lines?: OrderLine[];
		regionName?: string;
	};

	let { charges, totals, lines, regionName }: Props = $props();

	const shippingPending = $derived(charges.internationalShippingJpy === null);

	const shippingDetail = $derived(
		[regionName && `para ${regionName}`, `caixa de ${formatWeight(totals.weightGrams)}`]
			.filter(Boolean)
			.join(', ')
	);
</script>

<Receipt>
	{#if lines}
		<ul>
			{#each lines as line, index (index)}
				<li>
					<span class="item">
						<span class="quantity">{line.quantity}×</span>
						{line.name}
						{#if line.priceType === 'reference'}
							<span class="detail">preço de referência</span>
						{/if}
					</span>
					<span class="value price">{formatJpy(line.unitPriceJpy * line.quantity)}</span>
				</li>
			{/each}
		</ul>
	{/if}

	<dl>
		<div>
			<dt>
				<span>
					Produtos
					<span class="detail">({countLabel(totals.itemCount, 'item', 'itens')})</span>
				</span>
			</dt>
			<dd>{formatJpy(totals.productsJpy)}</dd>
		</div>
		<div>
			<dt><span>Frete interno no Japão</span></dt>
			<dd>{formatJpy(charges.domesticShippingJpy)}</dd>
		</div>
		<div>
			<dt><span>Taxa de serviço</span></dt>
			<dd>{formatJpy(charges.serviceFeeJpy)}</dd>
		</div>
		<div>
			<dt>
				<span>
					Frete internacional (EMS)
					<span class="detail block">{shippingDetail}</span>
				</span>
			</dt>
			<dd>
				{charges.internationalShippingJpy === null
					? 'a combinar'
					: formatJpy(charges.internationalShippingJpy)}
			</dd>
		</div>
	</dl>

	<div class="total">
		<span>Total estimado</span>
		<span class="price">{formatJpy(totals.totalJpy)}</span>
	</div>
	<p class="brl">
		<span aria-hidden="true">≈</span><span class="visually-hidden">aproximadamente</span>
		<strong>{formatBrl(totals.totalBrlCents)}</strong>
		<span class="detail block">Em reais, com câmbio aproximado.</span>
	</p>

	{#if shippingPending}
		<p class="notice">
			A caixa passou do peso máximo da tabela de frete. O frete internacional é calculado caso a
			caso, e o total acima ainda não inclui esse valor.
		</p>
	{/if}
</Receipt>

<style>
	ul {
		margin: 0 0 10px;
		padding: 0 0 10px;
		border-bottom: 1.5px dashed var(--line-strong);
		list-style: none;
	}

	li {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		padding: 5px 0;
		font-size: 0.9375rem;
		line-height: 1.4;
	}

	.quantity {
		font-weight: 650;
	}

	.value {
		flex: none;
		font-size: 1rem;
	}

	.detail {
		font-size: 0.8125rem;
		font-weight: 400;
		color: var(--ink-soft);
	}

	li .detail,
	.detail.block {
		display: block;
	}

	.total {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		margin-top: 10px;
		padding-top: 12px;
		border-top: 2px solid var(--ink);
		font-size: 1.0625rem;
		font-weight: 650;
	}

	.total .price {
		font-size: 1.75rem;
		line-height: 1;
	}

	.brl {
		margin-top: 4px;
		text-align: right;
		color: var(--ink-soft);
	}

	.brl strong {
		font-size: 1.0625rem;
		font-weight: 650;
		color: var(--ink);
	}

	.notice {
		margin-top: 14px;
	}
</style>
