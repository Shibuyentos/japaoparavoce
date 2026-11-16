<script lang="ts">
	import { formatBrl, formatJpy, formatWeight } from '#lib/format.ts';
	import type { OrderCharges, OrderTotals } from '#lib/types.ts';

	let { charges, totals }: { charges: OrderCharges; totals: OrderTotals } = $props();

	const shippingPending = $derived(charges.internationalShippingJpy === null);
</script>

<dl>
	<div>
		<dt>Produtos</dt>
		<dd>{formatJpy(totals.productsJpy)}</dd>
	</div>
	<div>
		<dt>Frete interno no Japão</dt>
		<dd>{formatJpy(charges.domesticShippingJpy)}</dd>
	</div>
	<div>
		<dt>Taxa de serviço</dt>
		<dd>{formatJpy(charges.serviceFeeJpy)}</dd>
	</div>
	<div>
		<dt>Frete internacional (EMS)</dt>
		<dd>
			{charges.internationalShippingJpy === null
				? 'a combinar'
				: formatJpy(charges.internationalShippingJpy)}
		</dd>
	</div>
	<div class="total">
		<dt>Total estimado</dt>
		<dd>{formatJpy(totals.totalJpy)}</dd>
	</div>
</dl>

<p class="brl">
	≈ <strong>{formatBrl(totals.totalBrlCents)}</strong>
	<small>Câmbio aproximado, só para referência.</small>
</p>

<p class="weight">Peso estimado da caixa: <strong>{formatWeight(totals.weightGrams)}</strong></p>

{#if shippingPending}
	<p class="pending">
		Seu pedido passou do peso máximo da tabela de frete. Nesse caso o frete internacional é
		calculado caso a caso, e o total acima ainda não inclui esse valor.
	</p>
{/if}

<style>
	dl {
		margin: 0;
	}

	dl div {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		padding: 9px 0;
		border-bottom: 1px dashed var(--line);
		font-size: 16px;
	}

	dt {
		color: var(--muted);
	}

	dd {
		margin: 0;
		font-weight: 700;
		white-space: nowrap;
	}

	.total {
		border-bottom: none;
		border-top: 2px solid #ffe0ee;
		margin-top: 4px;
		padding-top: 13px;
		font-size: 19px;
	}

	.total dt,
	.total dd {
		font-weight: 800;
		color: var(--pink-dark);
	}

	p {
		margin: 0;
	}

	.brl {
		text-align: right;
		font-size: 17px;
	}

	.brl strong {
		font-size: 22px;
		color: var(--ink-strong);
	}

	.brl small {
		display: block;
		font-size: 12.5px;
		color: var(--muted);
	}

	.weight {
		margin-top: 12px;
		font-size: 14.5px;
		color: var(--muted);
	}

	.pending {
		margin-top: 12px;
		background: var(--warn-bg);
		border: 1.5px solid var(--warn-line);
		border-radius: 12px;
		padding: 10px 12px;
		font-size: 14.5px;
		color: var(--warn-ink);
	}
</style>
