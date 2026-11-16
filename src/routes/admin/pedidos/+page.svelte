<script lang="ts">
	import { resolve } from '$app/paths';
	import OrderStatusBadge from '#lib/components/OrderStatusBadge.svelte';
	import { STORE_NAME } from '#lib/config.ts';
	import { formatDateTime, formatJpy } from '#lib/format.ts';
	import { ORDER_STATUS_LABELS } from '#lib/order-status.ts';
	import type { OrderStatus } from '#lib/types.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const statuses = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];
	const total = $derived(statuses.reduce((sum, status) => sum + (data.counts[status] ?? 0), 0));
</script>

<svelte:head>
	<title>Pedidos · Painel {STORE_NAME}</title>
</svelte:head>

<div class="wrap">
	<h1>Pedidos</h1>

	<nav class="filters" aria-label="Filtrar por status">
		<a
			href={resolve('/admin/pedidos')}
			aria-current={data.activeStatus === null ? 'page' : undefined}
		>
			Todos <span class="count">{total}</span>
		</a>
		{#each statuses as status (status)}
			<a
				href={resolve(`/admin/pedidos?status=${status}`)}
				aria-current={data.activeStatus === status ? 'page' : undefined}
			>
				{ORDER_STATUS_LABELS[status]} <span class="count">{data.counts[status] ?? 0}</span>
			</a>
		{/each}
	</nav>

	{#if data.orders.length === 0}
		<p class="empty">
			{data.activeStatus ? 'Nenhum pedido com esse status.' : 'Ainda não chegou nenhum pedido.'}
		</p>
	{:else}
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
					{#each data.orders as order (order.code)}
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
	{/if}
</div>

<style>
	h1 {
		font-size: 28px;
		font-weight: 800;
		color: var(--pink-title);
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 16px;
	}

	.filters a {
		padding: 6px 14px;
		border: 1.5px solid var(--line);
		border-radius: 999px;
		font-size: 15px;
		font-weight: 700;
		color: var(--ink);
		text-decoration: none;
	}

	.filters a:hover {
		border-color: var(--pink);
	}

	.filters a[aria-current='page'] {
		background: var(--pink);
		border-color: var(--pink);
		color: #ffffff;
	}

	.count {
		font-weight: 500;
		opacity: 0.8;
	}

	.empty {
		margin: 24px 0 0;
		padding: 28px 20px;
		text-align: center;
		background: #fff5f9;
		border: 1.5px dashed #f5a3c6;
		border-radius: var(--radius);
		color: var(--muted);
	}

	.table-scroll {
		margin-top: 18px;
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
