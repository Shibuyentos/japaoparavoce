<script lang="ts">
	import { resolve } from '$app/paths';
	import DailyOrdersChart from '#lib/components/admin/DailyOrdersChart.svelte';
	import OrdersTable from '#lib/components/admin/OrdersTable.svelte';
	import StatTile from '#lib/components/admin/StatTile.svelte';
	import TopProductsList from '#lib/components/admin/TopProductsList.svelte';
	import { STORE_NAME } from '#lib/config.ts';
	import { formatBrl, formatJpy } from '#lib/format.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const dashboard = $derived(data.dashboard);
	const current = $derived(dashboard.current);
	const previous = $derived(dashboard.previous);
</script>

<svelte:head>
	<title>Resumo · Painel {STORE_NAME}</title>
</svelte:head>

<div class="wrap">
	<h1>Resumo</h1>

	<section class="block" aria-labelledby="queue-title">
		<h2 id="queue-title">Para resolver</h2>
		<div class="tiles">
			<StatTile
				label="Aguardando orçamento"
				value={String(dashboard.statusCounts.received ?? 0)}
				hint="Pedidos novos, para responder no direct"
				href={resolve('/admin/pedidos?status=received')}
			/>
			<StatTile
				label="Aguardando pagamento"
				value={String(dashboard.statusCounts.quoted ?? 0)}
				hint="Orçamento já enviado"
				href={resolve('/admin/pedidos?status=quoted')}
			/>
			<StatTile
				label="Para comprar e enviar"
				value={String(dashboard.statusCounts.paid ?? 0)}
				hint="Pagamento confirmado"
				href={resolve('/admin/pedidos?status=paid')}
			/>
		</div>
	</section>

	<section class="block" aria-labelledby="period-title">
		<h2 id="period-title">Últimos {dashboard.periodDays} dias</h2>
		<p class="note">
			Contam os pedidos feitos no período. As setas comparam com os {dashboard.periodDays} dias anteriores.
		</p>
		<div class="tiles">
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
		<p class="note">
			Os valores são as estimativas calculadas no site. O valor final de cada pedido é o combinado
			no direct.
		</p>
	</section>

	<div class="columns block">
		<section class="panel" aria-labelledby="daily-title">
			<h2 id="daily-title">Pedidos por dia</h2>
			<p class="note">Dias no horário do Japão.</p>
			<DailyOrdersChart days={dashboard.ordersByDay} labelledby="daily-title" />
		</section>

		<section class="panel" aria-labelledby="products-title">
			<h2 id="products-title">Produtos mais pedidos</h2>
			<p class="note">Unidades nos últimos {dashboard.periodDays} dias, sem os cancelados.</p>
			<TopProductsList products={dashboard.topProducts} />
		</section>
	</div>

	<section class="block" aria-labelledby="recent-title">
		<div class="heading">
			<h2 id="recent-title">Últimos pedidos</h2>
			<a href={resolve('/admin/pedidos')}>Ver todos</a>
		</div>
		{#if dashboard.recentOrders.length === 0}
			<p class="note">Ainda não chegou nenhum pedido.</p>
		{:else}
			<OrdersTable orders={dashboard.recentOrders} />
		{/if}
	</section>
</div>

<style>
	h1 {
		font-size: 28px;
		font-weight: 800;
		color: var(--pink-title);
	}

	/* app.css dá às seções da loja um espaçamento grande, que não serve ao painel. */
	section {
		padding: 0;
	}

	.block {
		margin-top: 28px;
	}

	h2 {
		font-size: 20px;
		color: var(--ink-strong);
	}

	.note {
		margin: 2px 0 0;
		font-size: 14px;
		color: var(--muted);
	}

	.tiles {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
		margin: 12px 0 10px;
	}

	@media (min-width: 640px) {
		.tiles {
			grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
		}
	}

	.columns {
		display: grid;
		gap: 18px;
	}

	@media (min-width: 900px) {
		.columns {
			grid-template-columns: 1.5fr 1fr;
			align-items: start;
		}
	}

	.panel {
		padding: 18px 18px 20px;
		background: var(--surface);
		border: 1px solid #f6d3e0;
		border-radius: var(--radius);
		box-shadow: var(--shadow-card);
	}

	.panel .note {
		margin-bottom: 14px;
	}

	.heading {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 12px;
	}

	.heading a {
		font-size: 15px;
		font-weight: 700;
	}
</style>
