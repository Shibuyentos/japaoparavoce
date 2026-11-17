<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import InstagramIcon from '#lib/components/InstagramIcon.svelte';
	import OrderStatusBadge from '#lib/components/OrderStatusBadge.svelte';
	import OrderSummary from '#lib/components/OrderSummary.svelte';
	import { STORE_NAME } from '#lib/config.ts';
	import { formatDateTime } from '#lib/format.ts';
	import { ORDER_STATUS_LABELS } from '#lib/order-status.ts';
	import type { OrderStatus } from '#lib/types.ts';
	import type { PageProps, SubmitFunction } from './$types';

	let { data, form }: PageProps = $props();

	const order = $derived(data.order);

	// O que fazer agora em cada status e para qual status o pedido vai em seguida.
	const stages: Record<OrderStatus, { task: string; next?: OrderStatus; action?: string }> = {
		received: {
			task: 'Confira preços e frete e responda no direct com o valor final.',
			next: 'quoted',
			action: 'Marcar orçamento como enviado'
		},
		quoted: {
			task: 'Orçamento enviado. Aguardando o pagamento combinado no direct.',
			next: 'paid',
			action: 'Marcar como pago'
		},
		paid: {
			task: 'Pagamento confirmado. Comprar na loja, embalar, postar e mandar o código de rastreio no direct.',
			next: 'shipped',
			action: 'Marcar como enviado'
		},
		shipped: { task: 'Caixa postada. Não há mais nada a fazer neste pedido.' },
		cancelled: { task: 'Pedido cancelado.' }
	};

	const stage = $derived(stages[order.status]);

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
	<a class="back" href={resolve('/admin/pedidos')}><ArrowLeft aria-hidden="true" />Pedidos</a>

	<div class="title">
		<h1>Pedido <span class="code">{order.code}</span></h1>
		<OrderStatusBadge status={order.status} />
	</div>
	<p class="date">Recebido em {formatDateTime(order.createdAt)} (horário do Japão)</p>

	<div class="columns">
		<div class="stack">
			<section class="now" aria-labelledby="now-title">
				<h2 id="now-title">Agora</h2>
				<p>{stage.task}</p>

				<div class="actions">
					{#if stage.next}
						<form method="POST" action="?/status" use:enhance>
							<button class="btn btn-primary" name="status" value={stage.next}>
								{stage.action}
							</button>
						</form>
					{/if}
					<a
						class="btn btn-quiet"
						href="https://instagram.com/{order.instagramHandle}"
						target="_blank"
						rel="external noopener"
					>
						<InstagramIcon />Abrir @{order.instagramHandle}
					</a>
				</div>

				<p class="feedback" role="status">
					{#if form?.saved}Status atualizado.{/if}
					{#if form?.message}{form.message}{/if}
				</p>

				<details>
					<summary>Corrigir o status ou cancelar</summary>
					<form class="correct" method="POST" action="?/status" use:enhance={keepSelection}>
						<label for="status">Status do pedido</label>
						<div class="row">
							<select id="status" name="status" value={order.status}>
								{#each Object.entries(ORDER_STATUS_LABELS) as [status, label] (status)}
									<option value={status}>{label}</option>
								{/each}
							</select>
							<button class="btn btn-quiet">Salvar</button>
						</div>
					</form>
				</details>
			</section>

			<section aria-labelledby="customer-title">
				<h2 id="customer-title">Cliente</h2>
				<dl>
					<div>
						<dt>Nome</dt>
						<dd>{order.customerName}</dd>
					</div>
					<div>
						<dt>Instagram</dt>
						<dd>@{order.instagramHandle}</dd>
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
			</section>
		</div>

		<section aria-labelledby="items-title">
			<h2 id="items-title">Itens e valores</h2>
			<div class="nota">
				<OrderSummary
					charges={order.charges}
					totals={order.totals}
					lines={order.lines}
					regionName={order.regionName}
				/>
			</div>
		</section>
	</div>
</div>

<style>
	.back {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 44px;
		font-size: 0.9375rem;
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
		gap: 8px 12px;
	}

	h1 {
		font-size: 1.75rem;
	}

	.code {
		letter-spacing: 0.04em;
	}

	.date {
		margin-top: 4px;
		font-size: 0.875rem;
		color: var(--ink-soft);
	}

	.columns {
		display: grid;
		gap: 36px;
		margin-top: 24px;
	}

	.stack {
		display: grid;
		gap: 36px;
	}

	h2 {
		font-family: var(--font-body);
		font-size: 1.125rem;
		letter-spacing: 0;
	}

	.now {
		padding: 16px;
		border-left: 3px solid var(--beni);
		background: var(--paper);
	}

	.now > p {
		margin-top: 4px;
	}

	.actions {
		display: grid;
		gap: 10px;
		margin-top: 16px;
	}

	.actions .btn {
		width: 100%;
	}

	.feedback {
		margin-top: 10px;
		font-size: 0.9375rem;
		font-weight: 700;
		color: var(--ok);
	}

	.feedback:empty {
		display: none;
	}

	details {
		margin-top: 12px;
	}

	summary {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		font-size: 0.9375rem;
		color: var(--ink-soft);
		text-decoration: underline;
		text-underline-offset: 0.18em;
		cursor: pointer;
		list-style: none;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	.correct label {
		margin-bottom: 6px;
	}

	.row {
		display: flex;
		gap: 8px;
	}

	.row select {
		flex: 1;
		min-width: 0;
	}

	dl {
		margin: 8px 0 0;
		border-bottom: 1px solid var(--line);
	}

	dl div {
		display: grid;
		grid-template-columns: 104px 1fr;
		gap: 12px;
		padding: 10px 0;
		border-top: 1px solid var(--line);
		font-size: 0.9375rem;
	}

	dt {
		color: var(--ink-soft);
	}

	dd {
		margin: 0;
		font-weight: 700;
		overflow-wrap: anywhere;
	}

	dd.note {
		font-weight: 400;
		white-space: pre-wrap;
	}

	/* O painel tem fundo branco: a nota ganha o papel rosado em volta para o recibo aparecer. */
	.nota {
		margin-top: 8px;
		padding: 16px;
		background: var(--paper);
	}

	@media (min-width: 560px) {
		.actions {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (min-width: 900px) {
		.columns {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			gap: 56px;
			align-items: start;
		}
	}
</style>
