<script lang="ts">
	import Search from '@lucide/svelte/icons/search';
	import OrdersTable from '#lib/components/admin/OrdersTable.svelte';
	import { STORE_NAME } from '#lib/config.ts';
	import { countLabel } from '#lib/format.ts';
	import { adminOrdersHref } from '#lib/links.ts';
	import { ORDER_STATUS_LABELS } from '#lib/order-status.ts';
	import type { OrderStatus } from '#lib/types.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const statuses = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];
	const total = $derived(statuses.reduce((sum, status) => sum + (data.counts[status] ?? 0), 0));

	// Trocar de status mantém a busca que estiver ativa.
	const filterHref = (status: OrderStatus | null) => adminOrdersHref(status, data.search);
</script>

<svelte:head>
	<title>Pedidos · Painel {STORE_NAME}</title>
</svelte:head>

<div class="wrap">
	<h1>Pedidos</h1>

	<form class="search" method="GET" role="search">
		{#if data.activeStatus}
			<input type="hidden" name="status" value={data.activeStatus} />
		{/if}
		<label class="visually-hidden" for="busca">Buscar por código, nome ou Instagram</label>
		<div class="field">
			<Search aria-hidden="true" />
			<input
				id="busca"
				name="busca"
				type="search"
				value={data.search}
				placeholder="Código, nome ou @instagram"
				autocomplete="off"
				autocapitalize="none"
				spellcheck="false"
				maxlength="80"
			/>
		</div>
		<button class="btn btn-quiet">Buscar</button>
	</form>

	<nav class="filters" aria-label="Filtrar por status">
		<a href={filterHref(null)} aria-current={data.activeStatus === null ? 'page' : undefined}>
			Todos <span class="count">{total}</span>
		</a>
		{#each statuses as status (status)}
			<a href={filterHref(status)} aria-current={data.activeStatus === status ? 'page' : undefined}>
				{ORDER_STATUS_LABELS[status]} <span class="count">{data.counts[status] ?? 0}</span>
			</a>
		{/each}
	</nav>

	{#if data.search}
		<p class="result" role="status">
			{countLabel(data.orders.length, 'pedido encontrado', 'pedidos encontrados')} para “{data.search}”.
			<a href={adminOrdersHref(data.activeStatus)}>Limpar busca</a>
		</p>
	{/if}

	{#if data.orders.length === 0}
		<p class="empty">
			{#if data.search}
				Nenhum pedido bate com essa busca. Confira o código ou tente só uma parte do nome.
			{:else if data.activeStatus}
				Nenhum pedido com esse status.
			{:else}
				Ainda não chegou nenhum pedido.
			{/if}
		</p>
	{:else}
		<div class="list">
			<OrdersTable orders={data.orders} />
		</div>
	{/if}
</div>

<style>
	h1 {
		font-size: 1.75rem;
	}

	.search {
		display: flex;
		gap: 8px;
		max-width: 520px;
		margin-top: 16px;
	}

	.field {
		position: relative;
		flex: 1;
	}

	.field :global(svg) {
		position: absolute;
		top: 50%;
		left: 14px;
		width: 18px;
		height: 18px;
		color: var(--ink-soft);
		transform: translateY(-50%);
		pointer-events: none;
	}

	.field input {
		padding-left: 42px;
	}

	/* No celular os filtros rolam de lado, saindo pela borda da tela. */
	.filters {
		display: flex;
		gap: 8px;
		margin: 14px calc(var(--gutter) * -1) 0;
		padding: 2px var(--gutter);
		overflow-x: auto;
		scrollbar-width: none;
	}

	.filters::-webkit-scrollbar {
		display: none;
	}

	.filters a {
		flex: none;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 40px;
		padding: 0 14px;
		border: 1px solid var(--line-strong);
		border-radius: 999px;
		background: var(--surface);
		font-size: 0.9375rem;
		font-weight: 500;
		white-space: nowrap;
		color: var(--ink);
		text-decoration: none;
	}

	.filters a:hover {
		border-color: var(--ink-soft);
	}

	.filters a[aria-current='page'] {
		border-color: var(--ink);
		background: var(--ink);
		color: var(--surface);
	}

	.count {
		font-size: 0.8125rem;
		font-variant-numeric: tabular-nums;
		color: var(--ink-soft);
	}

	.filters a[aria-current='page'] .count {
		color: var(--blush-strong);
	}

	.result {
		margin-top: 16px;
		font-size: 0.9375rem;
		color: var(--ink-soft);
	}

	.empty {
		margin-top: 28px;
		color: var(--ink-soft);
	}

	.list {
		margin-top: 18px;
	}

	@media (min-width: 760px) {
		.filters {
			flex-wrap: wrap;
			margin: 16px 0 0;
			padding: 0;
		}

		.list {
			margin-top: 22px;
		}
	}
</style>
