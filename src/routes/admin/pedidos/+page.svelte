<script lang="ts">
	import { resolve } from '$app/paths';
	import OrdersTable from '#lib/components/admin/OrdersTable.svelte';
	import { STORE_NAME } from '#lib/config.ts';
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
		<div class="list">
			<OrdersTable orders={data.orders} />
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

	.list {
		margin-top: 18px;
	}
</style>
