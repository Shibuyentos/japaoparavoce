<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import OrderStatusBadge from '#lib/components/OrderStatusBadge.svelte';
	import OrderSummary from '#lib/components/OrderSummary.svelte';
	import { STORE_NAME } from '#lib/config.ts';
	import { formatDateTime, formatJpy } from '#lib/format.ts';
	import { ORDER_STATUS_LABELS } from '#lib/order-status.ts';
	import type { PageProps, SubmitFunction } from './$types';

	let { data, form }: PageProps = $props();

	const order = $derived(data.order);

	// O enhance padrão limpa o formulário depois do envio, o que voltaria o seletor
	// para o status anterior.
	const keepSelection: SubmitFunction = () => {
		return ({ update }) => update({ reset: false });
	};
</script>

<svelte:head>
	<title>Pedido {order.code} · Painel {STORE_NAME}</title>
</svelte:head>

<div class="wrap">
	<a class="back" href={resolve('/admin/pedidos')}><ArrowLeft />Pedidos</a>

	<div class="title">
		<h1>Pedido {order.code}</h1>
		<OrderStatusBadge status={order.status} />
	</div>
	<p class="date">Recebido em {formatDateTime(order.createdAt)} (horário do Japão)</p>

	<div class="columns">
		<div class="stack">
			<div class="panel">
				<h2>Cliente</h2>
				<dl>
					<div>
						<dt>Nome</dt>
						<dd>{order.customerName}</dd>
					</div>
					<div>
						<dt>Instagram</dt>
						<dd>
							<a
								href="https://instagram.com/{order.instagramHandle}"
								target="_blank"
								rel="external noopener"
							>
								@{order.instagramHandle}
							</a>
						</dd>
					</div>
					<div>
						<dt>Conta</dt>
						<dd>{order.accountEmail ?? 'Conta removida'}</dd>
					</div>
					<div>
						<dt>Entrega</dt>
						<dd>{order.regionName}</dd>
					</div>
					{#if order.note}
						<div>
							<dt>Observação</dt>
							<dd class="note">{order.note}</dd>
						</div>
					{/if}
				</dl>
			</div>

			<div class="panel">
				<h2>Status</h2>
				<form method="POST" action="?/status" use:enhance={keepSelection}>
					<label class="visually-hidden" for="status">Status do pedido</label>
					<select id="status" name="status" value={order.status}>
						{#each Object.entries(ORDER_STATUS_LABELS) as [status, label] (status)}
							<option value={status}>{label}</option>
						{/each}
					</select>
					<button class="btn btn-primary">Salvar</button>
				</form>
				<p class="feedback" role="status">
					{#if form?.saved}Status atualizado.{/if}
					{#if form?.message}{form.message}{/if}
				</p>
			</div>
		</div>

		<div class="panel">
			<h2>Itens</h2>
			<ul>
				{#each order.lines as line, index (index)}
					<li>
						<div>
							<span class="name">{line.quantity}× {line.name}</span>
							<span class="meta">
								{formatJpy(line.unitPriceJpy)} cada{line.priceType === 'reference'
									? ' · preço de referência'
									: ''}
							</span>
						</div>
						<strong>{formatJpy(line.unitPriceJpy * line.quantity)}</strong>
					</li>
				{/each}
			</ul>
			<OrderSummary charges={order.charges} totals={order.totals} />
		</div>
	</div>
</div>

<style>
	.back {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 15px;
		font-weight: 700;
		text-decoration: none;
	}

	.back :global(svg) {
		width: 17px;
		height: 17px;
	}

	.title {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
		margin-top: 12px;
	}

	h1 {
		font-size: 28px;
		font-weight: 800;
		color: var(--pink-title);
	}

	.date {
		margin: 4px 0 0;
		font-size: 14.5px;
		color: var(--muted);
	}

	.columns {
		display: grid;
		gap: 18px;
		margin-top: 20px;
	}

	@media (min-width: 900px) {
		.columns {
			grid-template-columns: 1fr 1.15fr;
			align-items: start;
		}
	}

	.stack {
		display: grid;
		gap: 18px;
	}

	.panel {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 20px 18px 22px;
		background: var(--surface);
		border: 1px solid #f6d3e0;
		border-radius: var(--radius);
		box-shadow: var(--shadow-card);
	}

	h2 {
		font-size: 20px;
		color: var(--pink-title);
	}

	dl {
		margin: 0;
	}

	dl div {
		display: grid;
		grid-template-columns: 110px 1fr;
		gap: 12px;
		padding: 8px 0;
		border-bottom: 1px dashed var(--line);
		font-size: 15.5px;
	}

	dl div:last-child {
		border-bottom: none;
	}

	dt {
		color: var(--muted);
	}

	dd {
		margin: 0;
		font-weight: 700;
		overflow-wrap: anywhere;
	}

	.note {
		font-weight: 500;
		white-space: pre-wrap;
	}

	form {
		display: flex;
		gap: 10px;
	}

	select {
		flex: 1;
		min-width: 0;
		font-family: inherit;
		font-size: 16px;
		color: var(--ink);
		background: #ffffff;
		border: 2px solid var(--pink-input);
		border-radius: 12px;
		padding: 10px 12px;
	}

	form .btn {
		padding: 10px 20px;
	}

	.feedback {
		margin: 0;
		font-size: 14.5px;
		font-weight: 700;
		color: var(--pink-dark);
	}

	.feedback:empty {
		display: none;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	li {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		padding: 9px 0;
		border-bottom: 1px dashed var(--line);
		font-size: 15.5px;
	}

	li strong {
		white-space: nowrap;
	}

	.name {
		display: block;
		font-weight: 700;
	}

	.meta {
		font-size: 13.5px;
		color: var(--muted);
	}
</style>
