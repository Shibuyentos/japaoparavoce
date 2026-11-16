<script lang="ts">
	import { resolve } from '$app/paths';
	import OrderStatusBadge from '#lib/components/OrderStatusBadge.svelte';
	import { countLabel, formatDateTime, formatJpy } from '#lib/format.ts';
	import type { AdminOrderSummary } from '#lib/types.ts';

	let { orders }: { orders: AdminOrderSummary[] } = $props();
</script>

<!-- No celular cada linha vira um bloco. Os papéis (role) mantêm a tabela para o leitor de tela
     mesmo com o CSS trocando o display das linhas e células; por isso os avisos de papel
     redundante ficam desligados aqui. -->
<!-- svelte-ignore a11y_no_redundant_roles -->
<table role="table">
	<!-- svelte-ignore a11y_no_redundant_roles -->
	<thead role="rowgroup">
		<!-- svelte-ignore a11y_no_redundant_roles -->
		<tr role="row">
			<th role="columnheader">Cliente</th>
			<th role="columnheader">Status</th>
			<th role="columnheader">Pedido</th>
			<th role="columnheader">Data</th>
			<th role="columnheader">Entrega</th>
			<th role="columnheader" class="number">Itens</th>
			<th role="columnheader" class="number">Total</th>
		</tr>
	</thead>
	<!-- svelte-ignore a11y_no_redundant_roles -->
	<tbody role="rowgroup">
		{#each orders as order (order.code)}
			<!-- svelte-ignore a11y_no_redundant_roles -->
			<tr role="row">
				<td role="cell" class="customer">
					<a href={resolve('/admin/pedidos/[code]', { code: order.code })}>
						{order.customerName}
					</a>
					<span class="handle">@{order.instagramHandle}</span>
				</td>
				<td role="cell" class="status"><OrderStatusBadge status={order.status} /></td>
				<td role="cell" class="code">{order.code}</td>
				<td role="cell" class="date">{formatDateTime(order.createdAt)}</td>
				<td role="cell" class="region">{order.regionName}</td>
				<td role="cell" class="items number">{countLabel(order.itemCount, 'item', 'itens')}</td>
				<td role="cell" class="total number">{formatJpy(order.totalJpy)}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		display: block;
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9375rem;
		font-variant-numeric: tabular-nums;
	}

	thead {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
	}

	tbody {
		display: block;
		border-bottom: 1px solid var(--line);
	}

	/* Celular: nome e total na primeira linha, status logo abaixo, detalhes em texto menor. */
	tr {
		position: relative;
		display: grid;
		grid-template-columns: 1fr auto;
		grid-template-areas:
			'customer total'
			'status   items'
			'code     date'
			'region   region';
		gap: 4px 12px;
		align-items: center;
		padding: 14px 0;
		border-top: 1px solid var(--line);
	}

	td {
		display: block;
		padding: 0;
	}

	.customer {
		grid-area: customer;
		min-width: 0;
	}

	.customer a {
		font-weight: 700;
		color: var(--ink);
		text-decoration: none;
	}

	/* O link do nome cobre a linha inteira: tocar em qualquer ponto abre o pedido. */
	.customer a::after {
		content: '';
		position: absolute;
		inset: 0;
	}

	tr:hover .customer a {
		text-decoration: underline;
	}

	.handle {
		display: block;
		font-size: 0.8125rem;
		color: var(--ink-soft);
		overflow-wrap: anywhere;
	}

	.status {
		grid-area: status;
	}

	.total {
		grid-area: total;
		font-weight: 700;
	}

	.items {
		grid-area: items;
		font-size: 0.8125rem;
		color: var(--ink-soft);
	}

	.code,
	.date,
	.region {
		font-size: 0.8125rem;
		color: var(--ink-soft);
	}

	.code {
		grid-area: code;
		letter-spacing: 0.04em;
	}

	.date {
		grid-area: date;
		text-align: right;
	}

	.region {
		grid-area: region;
	}

	.number {
		text-align: right;
		white-space: nowrap;
	}

	@media (min-width: 860px) {
		table {
			display: table;
		}

		thead {
			position: static;
			display: table-header-group;
			width: auto;
			height: auto;
			clip: auto;
		}

		tbody {
			display: table-row-group;
		}

		tr {
			display: table-row;
		}

		th,
		td {
			display: table-cell;
			padding: 12px 14px 12px 0;
			text-align: left;
			vertical-align: top;
			border-bottom: 1px solid var(--line);
		}

		th {
			padding-top: 0;
			border-bottom: 2px solid var(--ink);
			font-size: 0.8125rem;
			font-weight: 700;
			color: var(--ink-soft);
		}

		tr {
			border-top: none;
		}

		tbody tr:hover {
			background: var(--paper);
		}

		.code,
		.date,
		.region,
		.items {
			font-size: 0.9375rem;
			text-align: left;
			color: var(--ink);
		}

		th.number,
		td.number {
			padding-right: 0;
			padding-left: 14px;
			text-align: right;
		}
	}
</style>
