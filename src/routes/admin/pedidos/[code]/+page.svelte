<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import InstagramIcon from '#lib/components/InstagramIcon.svelte';
	import OrderProgress from '#lib/components/OrderProgress.svelte';
	import OrderStatusBadge from '#lib/components/OrderStatusBadge.svelte';
	import OrderSummary from '#lib/components/OrderSummary.svelte';
	import { STORE_NAME } from '#lib/config.ts';
	import { formatDateTime } from '#lib/format.ts';
	import { trackingHref } from '#lib/links.ts';
	import { ORDER_STATUS_LABELS } from '#lib/order-status.ts';
	import type { OrderStatus } from '#lib/types.ts';
	import type { PageProps, SubmitFunction } from './$types';

	let { data, form }: PageProps = $props();

	const order = $derived(data.order);

	// O que fazer agora em cada status e para qual status o pedido vai em seguida. O envio tem
	// formulário próprio, porque pede o código de rastreio.
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
			task: 'Pagamento confirmado. Comprar na loja, embalar e postar. Ao postar, informe o código de rastreio: ele aparece no pedido da cliente.'
		},
		shipped: { task: 'Caixa postada. A cliente acompanha a entrega pelo código de rastreio.' },
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

{#snippet trackingForm(label: string)}
	<form class="ship" method="POST" action="?/ship" use:enhance={keepSelection}>
		<label for="trackingCode">Código de rastreio do EMS</label>
		<input
			id="trackingCode"
			name="trackingCode"
			placeholder="EJ123456789JP"
			autocapitalize="characters"
			autocomplete="off"
			spellcheck="false"
			maxlength="20"
			required
			value={form?.trackingCode ?? order.trackingCode ?? ''}
			aria-invalid={form?.trackingError ? 'true' : undefined}
			aria-describedby={form?.trackingError ? 'tracking-error' : undefined}
		/>
		{#if form?.trackingError}
			<p class="field-error" id="tracking-error">{form.trackingError}</p>
		{/if}
		<button class="btn btn-primary">{label}</button>
	</form>
{/snippet}

<div class="wrap">
	<a class="text-link back" href={resolve('/admin/pedidos')}>
		<ArrowLeft aria-hidden="true" />Pedidos
	</a>

	<div class="title">
		<h1>Pedido <span class="code">{order.code}</span></h1>
		<OrderStatusBadge status={order.status} />
	</div>
	<p class="date">Feito em {formatDateTime(order.createdAt)}, horário do Japão</p>

	<div class="columns">
		<div class="stack">
			<section class="now" aria-labelledby="agora-titulo">
				<h2 id="agora-titulo">Agora</h2>
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

				{#if order.status === 'paid'}
					{@render trackingForm('Marcar como enviado')}
				{:else if order.status === 'shipped'}
					<div class="tracking">
						{#if order.trackingCode}
							<p>
								Rastreio: <strong class="price">{order.trackingCode}</strong>
								<a href={trackingHref(order.trackingCode)} target="_blank" rel="external noopener">
									<ExternalLink aria-hidden="true" />Abrir no Japan Post
								</a>
							</p>
						{:else}
							<p class="missing">Este pedido ainda não tem código de rastreio.</p>
						{/if}
						<details open={!order.trackingCode || Boolean(form?.trackingError)}>
							<summary>{order.trackingCode ? 'Corrigir o código' : 'Informar o código'}</summary>
							{@render trackingForm('Salvar código')}
						</details>
					</div>
				{/if}

				<p class="feedback" role="status">
					{#if form?.saved}Pedido atualizado.{/if}
					{#if form?.message}{form.message}{/if}
				</p>

				<details class="correct">
					<summary>Corrigir o status ou cancelar</summary>
					<form method="POST" action="?/status" use:enhance={keepSelection}>
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

			<section aria-labelledby="cliente-titulo">
				<h2 id="cliente-titulo">Cliente</h2>
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

			{#if order.status !== 'cancelled'}
				<section aria-labelledby="andamento-titulo">
					<h2 id="andamento-titulo">Andamento</h2>
					<div class="panel">
						<OrderProgress status={order.status} dates={order.dates} storeTime />
					</div>
				</section>
			{/if}
		</div>

		<section aria-labelledby="itens-titulo">
			<h2 id="itens-titulo">Itens e valores</h2>
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
		margin-top: -8px;
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
		grid-template-columns: minmax(0, 1fr);
		gap: 32px;
		margin-top: 24px;
	}

	.stack {
		display: grid;
		gap: 32px;
	}

	h2 {
		margin-bottom: 12px;
		font-size: 1.1875rem;
	}

	.now {
		padding: 20px 18px;
		border: 1.5px solid var(--beni);
		border-radius: var(--radius-l);
		background: var(--surface);
	}

	.now h2 {
		margin-bottom: 4px;
	}

	.actions {
		display: grid;
		gap: 10px;
		margin-top: 16px;
	}

	.actions .btn {
		width: 100%;
	}

	.ship {
		display: grid;
		gap: 8px;
		margin-top: 16px;
	}

	.ship .btn {
		margin-top: 4px;
	}

	.tracking {
		margin-top: 16px;
		padding-top: 14px;
		border-top: 1px solid var(--line);
	}

	.tracking p {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 4px 12px;
	}

	.tracking strong {
		font-size: 1.25rem;
		letter-spacing: 0.04em;
	}

	.tracking a {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 44px;
		font-weight: 600;
	}

	.tracking a :global(svg) {
		width: 16px;
		height: 16px;
	}

	.missing {
		font-weight: 600;
		color: var(--warn);
	}

	.feedback {
		margin-top: 10px;
		font-size: 0.9375rem;
		font-weight: 650;
		color: var(--ok);
	}

	.feedback:empty {
		display: none;
	}

	summary {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		font-size: 0.9375rem;
		color: var(--ink-soft);
		text-decoration: underline;
		text-underline-offset: 0.2em;
		cursor: pointer;
		list-style: none;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	.correct {
		margin-top: 8px;
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
		margin: 0;
		padding: 4px 18px;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--surface);
	}

	dl div {
		display: grid;
		grid-template-columns: 100px minmax(0, 1fr);
		gap: 12px;
		padding: 11px 0;
		font-size: 0.9375rem;
	}

	dl div + div {
		border-top: 1px solid var(--line);
	}

	dt {
		color: var(--ink-soft);
	}

	dd {
		margin: 0;
		font-weight: 600;
		overflow-wrap: anywhere;
	}

	dd.note {
		font-weight: 400;
		white-space: pre-wrap;
	}

	.panel {
		padding: 20px 18px;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--surface);
	}

	@media (min-width: 560px) {
		.actions {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (min-width: 1000px) {
		.columns {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			gap: 48px;
			align-items: start;
		}

		.now {
			padding: 24px;
		}
	}
</style>
