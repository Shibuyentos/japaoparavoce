<script lang="ts">
	import { resolve } from '$app/paths';
	import DailyOrdersChart from '#lib/components/admin/DailyOrdersChart.svelte';
	import OrdersTable from '#lib/components/admin/OrdersTable.svelte';
	import StatTile from '#lib/components/admin/StatTile.svelte';
	import TopProductsList from '#lib/components/admin/TopProductsList.svelte';
	import { STORE_NAME } from '#lib/config.ts';
	import { formatBrl, formatJpy } from '#lib/format.ts';
	import type { OrderStatus } from '#lib/types.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const dashboard = $derived(data.dashboard);
	const current = $derived(dashboard.current);
	const previous = $derived(dashboard.previous);

	// A fila do dia, na ordem do atendimento: responder, cobrar, comprar e postar.
	const queue: { status: OrderStatus; label: string; hint: string }[] = [
		{
			status: 'received',
			label: 'Aguardando orçamento',
			hint: 'Pedidos novos, para responder no direct'
		},
		{ status: 'quoted', label: 'Aguardando pagamento', hint: 'Orçamento já enviado' },
		{ status: 'paid', label: 'Para comprar e enviar', hint: 'Pagamento confirmado' }
	];
</script>

<svelte:head>
	<title>Resumo · Painel {STORE_NAME}</title>
</svelte:head>

<div class="wrap">
	<h1>Resumo</h1>

	<section aria-labelledby="queue-title">
		<h2 id="queue-title">Para resolver</h2>
		<div class="tiles queue">
			{#each queue as item (item.status)}
				{@const count = dashboard.statusCounts[item.status] ?? 0}
				<StatTile
					label={item.label}
					value={String(count)}
					hint={item.hint}
					href={resolve(`/admin/pedidos?status=${item.status}`)}
					highlight={count > 0}
				/>
			{/each}
		</div>
	</section>

	<section aria-labelledby="recent-title">
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

	<section aria-labelledby="period-title">
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

	<div class="columns">
		<section aria-labelledby="daily-title">
			<h2 id="daily-title">Pedidos por dia</h2>
			<p class="note">Dias no horário do Japão.</p>
			<DailyOrdersChart days={dashboard.ordersByDay} labelledby="daily-title" />
		</section>

		<section aria-labelledby="products-title">
			<h2 id="products-title">Produtos mais pedidos</h2>
			<p class="note">Unidades nos últimos {dashboard.periodDays} dias, sem os cancelados.</p>
			<TopProductsList products={dashboard.topProducts} />
		</section>
	</div>
</div>

<style>
	h1 {
		font-size: 1.75rem;
	}

	section {
		margin-top: 36px;
	}

	h2 {
		font-family: var(--font-body);
		font-size: 1.125rem;
		letter-spacing: 0;
	}

	.note {
		margin: 4px 0 14px;
		font-size: 0.875rem;
		color: var(--ink-soft);
	}

	.tiles {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 20px 16px;
		margin-top: 12px;
	}

	.tiles + .note {
		margin-top: 14px;
	}

	/* A fila é o que se resolve primeiro: no celular fica uma por linha, com o toque fácil. */
	.queue {
		grid-template-columns: 1fr;
		gap: 12px;
	}

	.heading {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 4px;
	}

	.heading a {
		font-size: 0.9375rem;
		font-weight: 700;
	}

	@media (min-width: 640px) {
		.queue {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 24px;
		}

		.tiles:not(.queue) {
			grid-template-columns: repeat(4, minmax(0, 1fr));
			gap: 24px;
		}
	}

	@media (min-width: 900px) {
		section {
			margin-top: 48px;
		}

		.columns {
			display: grid;
			grid-template-columns: 1.5fr 1fr;
			gap: 56px;
			align-items: start;
		}
	}
</style>
