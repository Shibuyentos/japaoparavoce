<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import { resolve } from '$app/paths';
	import CopyButton from '#lib/components/CopyButton.svelte';
	import InstagramIcon from '#lib/components/InstagramIcon.svelte';
	import LocalDate from '#lib/components/LocalDate.svelte';
	import OrderProgress from '#lib/components/OrderProgress.svelte';
	import OrderSummary from '#lib/components/OrderSummary.svelte';
	import { INSTAGRAM_HANDLE, INSTAGRAM_URL, STORE_NAME } from '#lib/config.ts';
	import { trackingHref } from '#lib/links.ts';
	import { ORDER_STATUS_MESSAGES } from '#lib/order-status.ts';
	import { orderSummaryText } from '#lib/order-summary.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const order = $derived(data.order);
	const message = $derived(ORDER_STATUS_MESSAGES[order.status]);
	const summaryText = $derived(orderSummaryText(order));

	let summaryField = $state<HTMLTextAreaElement>();
</script>

{#snippet summary()}
	<textarea
		bind:this={summaryField}
		readonly
		rows="9"
		aria-label="Resumo do pedido"
		value={summaryText}></textarea>
	<div class="actions">
		<!-- Sem permissão para a área de transferência, o texto fica selecionado para copiar à mão. -->
		<CopyButton
			text={summaryText}
			label="Copiar resumo"
			copiedLabel="Resumo copiado"
			primary
			onfail={() => summaryField?.select()}
		/>
		<a class="btn btn-quiet" href={INSTAGRAM_URL} target="_blank" rel="external noopener">
			<InstagramIcon />Abrir o direct
		</a>
	</div>
{/snippet}

<svelte:head>
	<title>Pedido {order.code} · {STORE_NAME}</title>
</svelte:head>

<a class="text-link back" href={resolve('/conta/pedidos')}>
	<ArrowLeft aria-hidden="true" />Meus pedidos
</a>

<header class="head">
	<p class="code">
		Pedido <strong>{order.code}</strong>, feito em <LocalDate date={order.createdAt} />
	</p>
	<h1>{message.title}</h1>
	<p class="lead">{message.text}</p>
</header>

<div class="columns">
	<div class="main">
		{#if order.status === 'received'}
			<section class="card action" aria-labelledby="enviar-titulo">
				<h2 id="enviar-titulo">Envie o resumo no direct</h2>
				<p class="note">Copie o texto e cole na conversa com {INSTAGRAM_HANDLE}.</p>
				{@render summary()}
			</section>
		{:else if order.status === 'quoted'}
			<section class="card action" aria-labelledby="orcamento-titulo">
				<h2 id="orcamento-titulo">Seu orçamento está no direct</h2>
				<p class="note">
					Confira os valores na nossa conversa e combine o pagamento por lá. Eu só compro depois do
					pagamento confirmado.
				</p>
				<a class="btn btn-primary" href={INSTAGRAM_URL} target="_blank" rel="external noopener">
					<InstagramIcon />Abrir o direct
				</a>
			</section>
		{:else if order.status === 'shipped'}
			<section class="card tracking" aria-labelledby="rastreio-titulo">
				<h2 id="rastreio-titulo">Código de rastreio</h2>
				{#if order.trackingCode}
					<p class="tracking-code price">{order.trackingCode}</p>
					<div class="actions">
						<a
							class="btn btn-primary"
							href={trackingHref(order.trackingCode)}
							target="_blank"
							rel="external noopener"
						>
							<ExternalLink aria-hidden="true" />Acompanhar a entrega
						</a>
						<CopyButton
							text={order.trackingCode}
							label="Copiar código"
							copiedLabel="Código copiado"
						/>
					</div>
					<p class="note">
						O link abre o rastreamento do correio do Japão. Quando a caixa chega ao seu país, o
						mesmo código também funciona no site do correio local.
					</p>
				{:else}
					<p class="note">
						O código está na nossa conversa no direct. Se não encontrar, me chama que eu mando de
						novo.
					</p>
				{/if}
			</section>
		{/if}

		{#if order.status !== 'cancelled'}
			<section aria-labelledby="andamento-titulo">
				<h2 id="andamento-titulo">Andamento</h2>
				<div class="progress">
					<OrderProgress status={order.status} dates={order.dates} />
				</div>
			</section>
		{:else}
			<a class="btn btn-quiet" href={INSTAGRAM_URL} target="_blank" rel="external noopener">
				<InstagramIcon />Falar comigo no direct
			</a>
		{/if}
	</div>

	<section aria-labelledby="nota-titulo">
		<h2 id="nota-titulo">Seu pedido</h2>
		<div class="nota">
			<OrderSummary
				charges={order.charges}
				totals={order.totals}
				lines={order.lines}
				regionName={order.regionName}
			/>
		</div>
		<p class="note">
			<strong>É uma estimativa:</strong> o valor final vem no orçamento, e o frete é confirmado depois
			de pesar a caixa, antes da postagem. Imposto de alfândega não incluído.
		</p>

		{#if order.status !== 'received' && order.status !== 'cancelled'}
			<details>
				<summary>Ver o resumo para o direct</summary>
				{@render summary()}
			</details>
		{/if}
	</section>
</div>

<style>
	.back {
		margin-top: -8px;
	}

	.head {
		margin-top: 8px;
	}

	.code {
		margin-bottom: 8px;
		font-size: 0.9375rem;
		color: var(--ink-soft);
	}

	.code strong {
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.06em;
		color: var(--ink);
	}

	.columns,
	.main {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 40px;
	}

	.columns {
		margin-top: 32px;
	}

	h2 {
		font-size: 1.25rem;
	}

	.card {
		padding: 22px 18px;
		border-radius: var(--radius-l);
	}

	.action {
		border: 1.5px solid var(--beni);
		background: var(--surface);
	}

	.tracking {
		background: var(--blush);
	}

	.note {
		margin-top: 12px;
		font-size: 0.875rem;
		color: var(--ink-soft);
	}

	.note strong {
		font-weight: 600;
		color: var(--ink);
	}

	.card .note {
		margin: 6px 0 16px;
	}

	.card .note:last-child {
		margin: 14px 0 0;
	}

	.tracking-code {
		margin-top: 10px;
		font-size: clamp(1.75rem, 8vw, 2.25rem);
		letter-spacing: 0.04em;
		white-space: normal;
		overflow-wrap: anywhere;
	}

	textarea {
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.actions {
		display: grid;
		gap: 10px;
		margin-top: 14px;
	}

	.progress,
	.nota {
		margin-top: 18px;
	}

	details {
		margin-top: 24px;
		border-top: 1px solid var(--line);
		border-bottom: 1px solid var(--line);
	}

	summary {
		display: flex;
		align-items: center;
		min-height: 48px;
		font-weight: 600;
		cursor: pointer;
	}

	details[open] {
		padding-bottom: 16px;
	}

	@media (min-width: 560px) {
		.actions {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (min-width: 960px) {
		.columns {
			grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
			gap: 64px;
			align-items: start;
			margin-top: 44px;
		}

		.card {
			padding: 28px;
		}
	}
</style>
