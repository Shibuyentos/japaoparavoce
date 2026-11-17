<script lang="ts">
	import { formatJpy, formatWeight } from '#lib/format.ts';
	import type { ShippingRegionRates } from '#lib/types.ts';

	let { regions }: { regions: ShippingRegionRates[] } = $props();

	// As faixas de peso de todas as regiões, da mais leve para a mais pesada.
	const weights = $derived(
		[...new Set(regions.flatMap((region) => region.rates.map((rate) => rate.maxWeightGrams)))].sort(
			(a, b) => a - b
		)
	);

	function priceFor(region: ShippingRegionRates, weightGrams: number): string {
		const rate = region.rates.find((candidate) => candidate.maxWeightGrams === weightGrams);
		return rate ? formatJpy(rate.priceJpy) : '—';
	}
</script>

<!-- No celular a tabela rola de lado; a coluna do peso fica parada à esquerda. -->
<div class="scroll">
	<table>
		<caption class="visually-hidden">Frete internacional EMS por peso da caixa e região</caption>
		<thead>
			<tr>
				<th scope="col">Caixa de até</th>
				{#each regions as region (region.code)}
					<th scope="col">{region.name}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each weights as weight (weight)}
				<tr>
					<th scope="row">{formatWeight(weight)}</th>
					{#each regions as region (region.code)}
						<td class="price">{priceFor(region, weight)}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.scroll {
		margin: 0 calc(var(--gutter) * -1);
		padding: 0 var(--gutter);
		overflow-x: auto;
	}

	table {
		min-width: 560px;
		width: 100%;
		border-collapse: separate;
		border-spacing: 0;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--surface);
		font-size: 0.9375rem;
	}

	th,
	td {
		padding: 12px 14px;
		border-bottom: 1px solid var(--line);
		text-align: right;
		vertical-align: bottom;
	}

	tbody tr:last-child > * {
		border-bottom: none;
	}

	thead th {
		font-size: 0.8125rem;
		font-weight: 600;
		line-height: 1.3;
		color: var(--ink-soft);
	}

	th:first-child {
		position: sticky;
		left: 0;
		background: var(--surface);
		text-align: left;
	}

	tbody th {
		font-weight: 600;
		white-space: nowrap;
	}

	td.price {
		font-size: 1rem;
	}

	@media (min-width: 900px) {
		.scroll {
			margin: 0;
			padding: 0;
		}
	}
</style>
