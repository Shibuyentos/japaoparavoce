<script lang="ts">
	import { resolve } from '$app/paths';
	import DailyOrdersChart from '#lib/components/admin/DailyOrdersChart.svelte';
	import OrdersTable from '#lib/components/admin/OrdersTable.svelte';
	import QueueTile from '#lib/components/admin/QueueTile.svelte';
	import ShoppingList from '#lib/components/admin/ShoppingList.svelte';
	import StatTile from '#lib/components/admin/StatTile.svelte';
	import TopProductsList from '#lib/components/admin/TopProductsList.svelte';
	import { STORE_NAME } from '#lib/config.ts';
	import { formatBrl, formatJpy, formatStoreDay } from '#lib/format.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const dashboard = $derived(data.dashboard);
	const current = $derived(dashboard.current);
	const previous = $derived(dashboard.previous);
</script>

<svelte:head>
	<title>Hoje · Painel {STORE_NAME}</title>
</svelte:head>

<div class="wrap">
	<h1>Hoje</h1>
	<p class="day">{formatStoreDay(new Date())}, no Japão</p>

	<section aria-labelledby="fila-titulo">
		<h2 id="fila-titulo" class="visually-hidden">Pedidos esperando uma ação</h2>
		<!-- A fila do dia, na ordem do atendimento: responder, cobrar, comprar e postar. -->
		<div class="queue">
			<QueueTile
				label="Responder com o orçamento"
				hint="Nenhum pedido novo"
				queue={dashboard.queue.received}
				href={resolve('/admin/pedidos?status=received')}
				needsAction
			/>
			<QueueTile
				label="Aguardando pagamento"
				hint="Nenhum orçamento em aberto"
				queue={dashboard.queue.quoted}
				href={resolve('/admin/pedidos?status=quoted')}
			/>
			<QueueTile
				label="Comprar e postar"
				hint="Nenhum pedido pago esperando"
				queue={dashboard.queue.paid}
				href={resolve('/admin/pedidos?status=paid')}
				needsAction
			/>
		</div>
	</section>

	<div class="columns">
		<section aria-labelledby="compras-titulo">
			<h2 id="compras-titulo">Lista de compras</h2>
			<p class="note">Os produtos dos pedidos pagos, somados.</p>
			<ShoppingList items={dashboard.shoppingList} />
		</section>

		<section aria-labelledby="recentes-titulo">
			<div class="heading">
				<h2 id="recentes-titulo">Últimos pedidos</h2>
				<a href={resolve('/admin/pedidos')}>Ver todos</a>
			</div>
			{#if dashboard.recentOrders.length === 0}
				<p class="note">Ainda não chegou nenhum pedido.</p>
			{:else}
				<OrdersTable orders={dashboard.recentOrders} />
			{/if}
		</section>
	</div>

	<section aria-labelledby="periodo-titulo">
		<h2 id="periodo-titulo">Últimos {dashboard.periodDays} dias</h2>
		<p class="note">
			Pedidos feitos no período, comparados com os {dashboard.periodDays} dias anteriores. Os valores
			são as estimativas do site; o final de cada pedido é o combinado no direct.
		</p>
		<div class="stats">
			<StatTile
				label="Pedidos feitos"
				value={String(current.orderCount)}
				change={current.orderCount - previous.orderCount}
			/>
			<StatTile
				label="Pedidos pagos"
				value={String(current.paidCount)}
				change={current.paidCount - previous.paidCount}
			/>
			<StatTile
				label="Valor dos pedidos pagos"
				value={formatJpy(current.paidJpy)}
				change={current.paidJpy - previous.paidJpy}
				formatChange={formatJpy}
				hint="≈ {formatBrl(current.paidBrlCents)}"
			/>
			<StatTile
				label="Taxas de serviço"
				value={formatJpy(current.serviceFeesJpy)}
				change={current.serviceFeesJpy - previous.serviceFeesJpy}
				formatChange={formatJpy}
				hint="Dos pedidos pagos"
			/>
		</div>

		<div class="columns charts">
			<div class="panel">
				<h3 id="diario-titulo">Pedidos por dia</h3>
				<p class="note">Dias no horário do Japão.</p>
				<DailyOrdersChart days={dashboard.ordersByDay} labelledby="diario-titulo" />
			</div>

			<div class="panel">
				<h3>Produtos mais pedidos</h3>
				<p class="note">Unidades no período, sem os pedidos cancelados.</p>
				<TopProductsList products={dashboard.topProducts} />
			</div>
		</div>
	</section>
</div>

<style>
	h1 {
		font-size: 1.75rem;
	}

	.day {
		margin-top: 2px;
		font-size: 0.9375rem;
		color: var(--ink-soft);
	}

	section {
		margin-top: 32px;
	}

	h2 {
		font-size: 1.1875rem;
	}

	h3 {
		font-size: 1rem;
	}

	.note {
		margin: 4px 0 14px;
		font-size: 0.875rem;
		color: var(--ink-soft);
	}

	.queue {
		display: grid;
		gap: 10px;
		margin-top: 20px;
	}

	.heading {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 14px;
	}

	.heading a {
		font-size: 0.9375rem;
		font-weight: 600;
	}

	.columns {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 0 40px;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
	}

	.charts {
		gap: 10px;
		margin-top: 10px;
	}

	.panel {
		padding: 18px;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--surface);
	}

	@media (min-width: 760px) {
		.queue {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 16px;
		}

		.stats {
			grid-template-columns: repeat(4, minmax(0, 1fr));
			gap: 16px;
		}
	}

	@media (min-width: 1100px) {
		section {
			margin-top: 44px;
		}

		.columns {
			grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
			align-items: start;
		}

		.charts {
			grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
			gap: 16px;
			margin-top: 16px;
		}
	}
</style>
