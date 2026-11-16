<script lang="ts">
	import ShoppingBag from '@lucide/svelte/icons/shopping-bag';
	import { resolve } from '$app/paths';
	import LocalDate from '#lib/components/LocalDate.svelte';
	import OrderStatusBadge from '#lib/components/OrderStatusBadge.svelte';
	import { STORE_NAME } from '#lib/config.ts';
	import { formatBrl, formatJpy } from '#lib/format.ts';
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
		<a class="btn btn-primary" href={resolve('/vitrine')}><ShoppingBag />Ver a vitrine</a>
	</div>
{:else}
	<ul>
		{#each data.orders as order (order.code)}
			<li class="panel">
				<div class="main">
					<a href={orderHref(order.code)}>Pedido {order.code}</a>
					<span class="meta">
						<LocalDate date={order.createdAt} /> ·
						{order.itemCount === 1 ? '1 item' : `${order.itemCount} itens`}
					</span>
				</div>
				<OrderStatusBadge status={order.status} />
				<div class="total">
					<strong>{formatJpy(order.totalJpy)}</strong>
					<span class="meta">≈ {formatBrl(order.totalBrlCents)}</span>
				</div>
			</li>
		{/each}
	</ul>
{/if}

<style>
	h1 {
		font-size: clamp(24px, 5vw, 32px);
		font-weight: 800;
		color: var(--pink-title);
	}

	.empty {
		margin-top: 20px;
		text-align: center;
		background: #fff5f9;
		border: 1.5px dashed #f5a3c6;
		border-radius: 20px;
		padding: 32px 22px;
	}

	.empty p {
		margin: 0 auto 16px;
		max-width: 520px;
	}

	ul {
		list-style: none;
		margin: 20px 0 0;
		padding: 0;
		display: grid;
		gap: 12px;
	}

	li {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px 18px;
		padding: 14px 18px;
	}

	li:hover {
		border-color: var(--pink);
	}

	.main {
		display: flex;
		flex-direction: column;
		margin-right: auto;
	}

	.main a {
		font-size: 17px;
		font-weight: 800;
		color: var(--ink-strong);
		text-decoration: none;
	}

	/* O link cobre o cartão inteiro, então qualquer clique abre o pedido. */
	.main a::after {
		content: '';
		position: absolute;
		inset: 0;
	}

	.meta {
		font-size: 14px;
		color: var(--muted);
	}

	.total {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		min-width: 110px;
	}
</style>
