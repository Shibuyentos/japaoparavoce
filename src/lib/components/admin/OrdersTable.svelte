<script lang="ts">
	import { resolve } from '$app/paths';
	import OrderStatusBadge from '#lib/components/OrderStatusBadge.svelte';
	import { formatDateTime, formatJpy } from '#lib/format.ts';
	import type { OrderListItem } from '#lib/types.ts';

	let { orders }: { orders: OrderListItem[] } = $props();
</script>

<div class="table-scroll">
	<table>
		<thead>
			<tr>
				<th>Pedido</th>
				<th>Status</th>
				<th>Data</th>
				<th>Cliente</th>
				<th>Entrega</th>
				<th class="number">Itens</th>
				<th class="number">Total</th>
			</tr>
		</thead>
		<tbody>
			{#each orders as order (order.code)}
				<tr>
					<td>
						<a href={resolve('/admin/pedidos/[code]', { code: order.code })}>{order.code}</a>
					</td>
					<td><OrderStatusBadge status={order.status} /></td>
					<td>{formatDateTime(order.createdAt)}</td>
					<td>
						{order.customerName}
						<span class="handle">@{order.instagramHandle}</span>
					</td>
					<td>{order.regionName}</td>
					<td class="number">{order.itemCount}</td>
					<td class="number">{formatJpy(order.totalJpy)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.table-scroll {
		overflow-x: auto;
		border: 1px solid #f6d3e0;
		border-radius: var(--radius);
		box-shadow: var(--shadow-card);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 15px;
		white-space: nowrap;
	}

	th,
	td {
		padding: 11px 14px;
		text-align: left;
		border-bottom: 1px solid var(--line-soft);
	}

	th {
		font-size: 13px;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--muted);
		background: var(--pink-bg);
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	tbody tr:hover {
		background: #fffafc;
	}

	td a {
		font-weight: 800;
	}

	.number {
		text-align: right;
	}

	.handle {
		display: block;
		font-size: 13.5px;
		color: var(--muted);
	}
</style>
