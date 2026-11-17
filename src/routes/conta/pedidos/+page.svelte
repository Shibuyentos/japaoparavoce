<script lang="ts">
	import { resolve } from '$app/paths';
	import LocalDate from '#lib/components/LocalDate.svelte';
	import OrderStatusBadge from '#lib/components/OrderStatusBadge.svelte';
	import { STORE_NAME } from '#lib/config.ts';
	import { countLabel, formatBrl, formatJpy } from '#lib/format.ts';
	import { orderHref } from '#lib/links.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Meus pedidos · {STORE_NAME}</title>
</svelte:head>

<h1>Meus pedidos</h1>

{#if data.orders.length === 0}
	<div class="empty">
		<p>Você ainda não fez nenhum pedido. Escolha os produtos na vitrine e monte o primeiro.</p>
		<a class="btn btn-primary" href={resolve('/vitrine')}>Ver a vitrine</a>
	</div>
{:else}
	<ul>
		{#each data.orders as order (order.code)}
			<li>
				<div class="main">
					<a href={orderHref(order.code)}>Pedido <span class="code">{order.code}</span></a>
					<span class="meta">
						<LocalDate date={order.createdAt} />, {countLabel(order.itemCount, 'item', 'itens')}
					</span>
				</div>
				<div class="total">
					<strong>{formatJpy(order.totalJpy)}</strong>
					<span class="meta">
						<span aria-hidden="true">≈</span><span class="visually-hidden">aproximadamente</span>
						{formatBrl(order.totalBrlCents)}
					</span>
				</div>
				<div class="status"><OrderStatusBadge status={order.status} /></div>
			</li>
		{/each}
	</ul>
{/if}

<style>
	.empty {
		max-width: 520px;
		margin-top: 16px;
	}

	.empty p {
		color: var(--ink-soft);
	}

	.empty .btn {
		margin-top: 20px;
	}

	ul {
		margin: 20px 0 0;
		padding: 0;
		border-bottom: 1px solid var(--line);
		list-style: none;
	}

	li {
		position: relative;
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 6px 16px;
		align-items: center;
		padding: 14px 0;
		border-top: 1px solid var(--line);
		font-variant-numeric: tabular-nums;
	}

	.main {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.main a {
		font-weight: 700;
		color: var(--ink);
		text-decoration: none;
	}

	/* O link cobre a linha inteira: tocar em qualquer ponto abre o pedido. */
	.main a::after {
		content: '';
		position: absolute;
		inset: 0;
	}

	li:hover .main a {
		text-decoration: underline;
	}

	.code {
		letter-spacing: 0.04em;
	}

	.meta {
		font-size: 0.8125rem;
		color: var(--ink-soft);
	}

	.total {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.status {
		grid-column: 1 / -1;
	}

	@media (min-width: 640px) {
		li {
			grid-template-columns: 1fr auto 140px;
		}

		.status {
			grid-column: 2;
			grid-row: 1;
		}
	}
</style>
