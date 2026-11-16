<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Copy from '@lucide/svelte/icons/copy';
	import InstagramIcon from '#lib/components/InstagramIcon.svelte';
	import OrderProgress from '#lib/components/OrderProgress.svelte';
	import OrderSummary from '#lib/components/OrderSummary.svelte';
	import { INSTAGRAM_HANDLE, INSTAGRAM_URL, STORE_NAME } from '#lib/config.ts';
	import { ORDER_STATUS_MESSAGES } from '#lib/order-status.ts';
	import { orderSummaryText } from '#lib/order-summary.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const order = $derived(data.order);
	const message = $derived(ORDER_STATUS_MESSAGES[order.status]);
	const summaryText = $derived(orderSummaryText(order));

	// Enquanto o pedido não foi respondido, mandar o resumo no direct é o que falta fazer.
	const awaitingSummary = $derived(order.status === 'received');

	const FEEDBACK_MS = 2600;

	let summaryField = $state<HTMLTextAreaElement>();
	let copied = $state(false);

	async function copySummary() {
		try {
			await navigator.clipboard.writeText(summaryText);
			copied = true;
			setTimeout(() => (copied = false), FEEDBACK_MS);
		} catch {
			// Sem permissão para a área de transferência: o texto fica selecionado para copiar à mão.
			summaryField?.select();
		}
	}
</script>

{#snippet summary()}
	<textarea
		bind:this={summaryField}
		readonly
		rows="10"
		aria-label="Resumo do pedido"
		value={summaryText}></textarea>
	<div class="actions">
		<button class="btn btn-primary" type="button" onclick={copySummary}>
			{#if copied}<Check />Resumo copiado{:else}<Copy />Copiar resumo{/if}
		</button>
		<a class="btn btn-quiet" href={INSTAGRAM_URL} target="_blank" rel="external noopener">
			<InstagramIcon />Abrir {INSTAGRAM_HANDLE}
		</a>
	</div>
	<p class="visually-hidden" role="status">{copied ? 'Resumo copiado.' : ''}</p>
{/snippet}

<svelte:head>
	<title>Pedido {order.code} · {STORE_NAME}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="wrap page">
	<header>
		<p class="code">Pedido <strong>{order.code}</strong></p>
		<h1>{message.title}</h1>
		<p class="lead">{message.text}</p>
	</header>

	<div class="columns">
		<div class="main">
			{#if awaitingSummary}
				<section class="send" aria-labelledby="enviar-titulo">
					<h2 id="enviar-titulo">Envie o resumo no direct</h2>
					<p class="note">Copie o texto abaixo e cole na conversa com {INSTAGRAM_HANDLE}.</p>
					{@render summary()}
				</section>
			{/if}

			{#if order.status !== 'cancelled'}
				<section aria-labelledby="andamento-titulo">
					<h2 id="andamento-titulo">Andamento</h2>
					<div class="progress">
						<OrderProgress status={order.status} />
					</div>
					<p class="note">
						Guarde o código <strong>{order.code}</strong> ou o endereço desta página: é por eles que você
						acompanha o pedido.
					</p>
				</section>
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
				<strong>É uma estimativa:</strong> o valor final é confirmado depois de pesar a caixa, antes da
				postagem. Imposto de alfândega não incluído.
			</p>

			{#if !awaitingSummary && order.status !== 'cancelled'}
				<details>
					<summary>Ver o resumo para o direct</summary>
					{@render summary()}
				</details>
			{/if}
		</section>
	</div>
</div>

<style>
	.page {
		padding-top: 32px;
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
		gap: 40px;
	}

	.columns {
		margin-top: 36px;
	}

	h2 {
		font-size: 1.375rem;
	}

	.note {
		margin-top: 12px;
		font-size: 0.875rem;
		color: var(--ink-soft);
	}

	.note strong {
		color: var(--ink);
	}

	.send .note {
		margin: 4px 0 12px;
	}

	textarea {
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.actions {
		display: grid;
		gap: 10px;
		margin-top: 12px;
	}

	.progress,
	.nota {
		margin-top: 16px;
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
		font-weight: 700;
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

	@media (min-width: 900px) {
		.page {
			padding-top: 48px;
		}

		.columns {
			grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
			gap: 72px;
			align-items: start;
			margin-top: 48px;
		}
	}
</style>
