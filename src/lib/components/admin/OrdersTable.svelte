<script lang="ts">
	import { resolve } from '$app/paths';
	import OrderStatusBadge from '#lib/components/OrderStatusBadge.svelte';
	import { countLabel, formatDateTime, formatJpy, formatWaiting } from '#lib/format.ts';
	import type { OrderListItem, OrderStatus } from '#lib/types.ts';

	let { orders }: { orders: OrderListItem[] } = $props();

	// Só nesses status o pedido espera alguém agir; nos outros, o tempo parado não importa.
	const WAITING_STATUSES: OrderStatus[] = ['received', 'quoted', 'paid'];
</script>

<!-- Em espaço estreito cada linha vira um bloco. A troca segue a largura do espaço que a tabela
     recebe (container query), não a da tela: no resumo do painel ela fica numa coluna estreita.
     Os papéis (role) mantêm a tabela para o leitor de tela mesmo com o CSS trocando o display
     das linhas e células; por isso os avisos de papel redundante ficam desligados aqui. -->
<div class="orders">
	<!-- svelte-ignore a11y_no_redundant_roles -->
	<table role="table">
		<!-- svelte-ignore a11y_no_redundant_roles -->
		<thead role="rowgroup">
			<!-- svelte-ignore a11y_no_redundant_roles -->
			<tr role="row">
				<th role="columnheader">Cliente</th>
				<th role="columnheader">Status</th>
				<th role="columnheader">Pedido</th>
				<th role="columnheader">Feito em</th>
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
					<td role="cell" class="status">
						<OrderStatusBadge status={order.status} />
						{#if WAITING_STATUSES.includes(order.status)}
							<span class="waiting">{formatWaiting(order.statusSince)}</span>
						{/if}
					</td>
					<td role="cell" class="code">{order.code}</td>
					<td role="cell" class="date">{formatDateTime(order.createdAt)}</td>
					<td role="cell" class="region">{order.regionName}</td>
					<td role="cell" class="items number">{countLabel(order.itemCount, 'item', 'itens')}</td>
					<td role="cell" class="total number price">{formatJpy(order.totalJpy)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.orders {
		container-type: inline-size;
	}

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
		display: grid;
		gap: 10px;
	}

	/* Celular: nome e total na primeira linha, status logo abaixo, detalhes em texto menor. */
	tr {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		grid-template-areas:
			'customer total'
			'status   items'
			'code     date'
			'region   region';
		gap: 6px 12px;
		align-items: center;
		padding: 14px 16px;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--surface);
	}

	tr:hover {
		border-color: var(--ink-soft);
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
		font-weight: 650;
		color: var(--ink);
		text-decoration: none;
	}

	/* O link do nome cobre a linha inteira: tocar em qualquer ponto abre o pedido. */
	.customer a::after {
		content: '';
		position: absolute;
		inset: 0;
	}

	.customer a:focus-visible {
		outline: none;
	}

	tr:has(.customer a:focus-visible) {
		outline: 2.5px solid var(--beni);
		outline-offset: 2px;
	}

	.handle {
		display: block;
		font-size: 0.8125rem;
		color: var(--ink-soft);
		overflow-wrap: anywhere;
	}

	.status {
		grid-area: status;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 4px 8px;
	}

	.waiting {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--ink-soft);
	}

	.total {
		grid-area: total;
		font-size: 1.0625rem;
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

	@container (min-width: 760px) {
		table {
			display: table;
			overflow: hidden;
			border: 1px solid var(--line);
			border-radius: var(--radius);
			background: var(--surface);
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
			border: none;
			border-radius: 0;
		}

		th,
		td {
			display: table-cell;
			padding: 12px 14px;
			border-bottom: 1px solid var(--line);
			text-align: left;
			vertical-align: middle;
		}

		tbody tr:last-child td {
			border-bottom: none;
		}

		th {
			background: var(--paper);
			font-size: 0.8125rem;
			font-weight: 600;
			color: var(--ink-soft);
		}

		tbody tr:hover {
			background: var(--paper);
		}

		.status {
			display: table-cell;
		}

		.waiting {
			display: block;
			margin-top: 2px;
		}

		.code,
		.date,
		.region,
		.items {
			font-size: 0.9375rem;
			color: var(--ink);
		}

		.date {
			text-align: left;
		}

		th.number,
		td.number {
			text-align: right;
		}
	}
</style>
