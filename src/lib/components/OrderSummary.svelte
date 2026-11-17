<script lang="ts">
	import { countLabel, formatBrl, formatJpy, formatWeight } from '#lib/format.ts';
	import type { OrderCharges, OrderLine, OrderTotals } from '#lib/types.ts';

	type Props = {
		charges: OrderCharges;
		totals: OrderTotals;
		// Com os itens, a nota lista cada produto antes das taxas. Sem eles, mostra só a soma.
		lines?: OrderLine[];
		regionName?: string;
	};

	let { charges, totals, lines, regionName }: Props = $props();

	const shippingPending = $derived(charges.internationalShippingJpy === null);
</script>

<!-- A nota do pedido: o mesmo recibo aparece no carrinho, no acompanhamento e no painel. -->
<div class="nota">
	<div class="paper">
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
						<span class="value">{formatJpy(line.unitPriceJpy * line.quantity)}</span>
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
						{#if regionName}<span class="detail region">para {regionName}</span>{/if}
					</span>
				</dt>
				<dd>
					{charges.internationalShippingJpy === null
						? 'a combinar'
						: formatJpy(charges.internationalShippingJpy)}
				</dd>
			</div>
			<div class="total">
				<dt><span>Total estimado</span></dt>
				<dd>{formatJpy(totals.totalJpy)}</dd>
			</div>
		</dl>

		<p class="brl">
			<span aria-hidden="true">≈</span><span class="visually-hidden">aproximadamente</span>
			<strong>{formatBrl(totals.totalBrlCents)}</strong>
			<span class="detail">Câmbio aproximado, só para referência.</span>
		</p>

		<p class="weight">
			Peso estimado da caixa: <strong>{formatWeight(totals.weightGrams)}</strong>
		</p>

		{#if shippingPending}
			<p class="notice">
				O pedido passou do peso máximo da tabela de frete. Nesse caso o frete internacional é
				calculado caso a caso, e o total acima ainda não inclui esse valor.
			</p>
		{/if}
	</div>
</div>

<style>
	/* A sombra fica no elemento de fora porque o recorte do papel esconderia uma sombra própria. */
	.nota {
		filter: drop-shadow(0 1px 2px rgb(42 24 32 / 0.16));
	}

	/* Borda de baixo serrilhada, como papel de recibo destacado. */
	.paper {
		padding: 18px 16px 28px;
		background: var(--white);
		font-variant-numeric: tabular-nums;
		mask: conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% / 14px 100%;
	}

	ul {
		margin: 0 0 10px;
		padding: 0 0 10px;
		border-bottom: 1.5px dashed var(--line);
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
		font-weight: 700;
	}

	.value,
	dd {
		flex: none;
		margin: 0;
		font-weight: 700;
		white-space: nowrap;
	}

	.detail {
		font-size: 0.8125rem;
		font-weight: 400;
		color: var(--ink-soft);
	}

	li .detail,
	.detail.region {
		display: block;
	}

	dl {
		margin: 0;
	}

	dl div {
		display: flex;
		align-items: baseline;
		gap: 8px;
		padding: 5px 0;
		font-size: 0.9375rem;
	}

	/* O pontilhado liga o nome ao valor, como em uma nota impressa. */
	dt {
		flex: 1;
		display: flex;
		align-items: baseline;
		gap: 8px;
	}

	dt::after {
		content: '';
		flex: 1;
		min-width: 12px;
		border-bottom: 1.5px dotted var(--sakura);
		transform: translateY(-4px);
	}

	.total {
		margin-top: 8px;
		padding-top: 12px;
		border-top: 2px solid var(--ink);
		font-family: var(--font-display);
		font-size: 1.25rem;
	}

	.total dt::after {
		border-bottom-color: transparent;
	}

	.brl {
		text-align: right;
		color: var(--ink-soft);
	}

	.brl strong {
		font-size: 1.0625rem;
		color: var(--ink);
	}

	.brl .detail {
		display: block;
	}

	.weight {
		margin-top: 12px;
		font-size: 0.875rem;
		color: var(--ink-soft);
	}

	.weight strong {
		color: var(--ink);
	}

	.notice {
		margin-top: 12px;
	}
</style>
