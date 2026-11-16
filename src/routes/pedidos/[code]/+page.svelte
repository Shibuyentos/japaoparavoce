<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Copy from '@lucide/svelte/icons/copy';
	import InstagramIcon from '#lib/components/InstagramIcon.svelte';
	import OrderSummary from '#lib/components/OrderSummary.svelte';
	import { INSTAGRAM_HANDLE, INSTAGRAM_URL, STORE_NAME } from '#lib/config.ts';
	import { formatJpy } from '#lib/format.ts';
	import { orderSummaryText } from '#lib/order-summary.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const order = $derived(data.order);
	const summaryText = $derived(orderSummaryText(order));

	const FEEDBACK_MS = 2600;

	let summaryField: HTMLTextAreaElement;
	let copied = $state(false);

	async function copySummary() {
		try {
			await navigator.clipboard.writeText(summaryText);
			copied = true;
			setTimeout(() => (copied = false), FEEDBACK_MS);
		} catch {
			// Sem permissão para a área de transferência: o texto fica selecionado para copiar à mão.
			summaryField.select();
		}
	}
</script>

<svelte:head>
	<title>Pedido {order.code} · {STORE_NAME}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section>
	<div class="wrap">
		<span class="kicker">Pedido {order.code}</span>
		<h1>Pedido recebido! 🌸</h1>
		<p class="lead">
			Agora falta só um passo: <strong>envie o resumo abaixo no direct do Instagram</strong>. É na
			conversa que eu confirmo os valores e a gente combina o pagamento.
		</p>

		<div class="columns">
			<div class="panel">
				<h2>1. Copie o resumo</h2>
				<textarea
					bind:this={summaryField}
					readonly
					rows="12"
					aria-label="Resumo do pedido"
					value={summaryText}></textarea>
				<button class="btn btn-primary" type="button" onclick={copySummary}>
					{#if copied}
						<Check />Copiado! Agora cole no Instagram
					{:else}
						<Copy />Copiar resumo do pedido
					{/if}
				</button>

				<h2>2. Cole no direct</h2>
				<a class="btn btn-ghost" href={INSTAGRAM_URL} target="_blank" rel="external noopener">
					<InstagramIcon />Abrir o Instagram {INSTAGRAM_HANDLE}
				</a>
				<p class="note">
					Guarde o código <strong>{order.code}</strong>: é por ele que eu encontro o seu pedido.
				</p>
			</div>

			<div class="panel">
				<h2>Seu pedido</h2>
				<ul>
					{#each order.lines as line, index (index)}
						<li>
							<span>{line.quantity}× {line.name}</span>
							<strong>{formatJpy(line.unitPriceJpy * line.quantity)}</strong>
						</li>
					{/each}
				</ul>
				<p class="note">Entrega para: <strong>{order.regionName}</strong></p>
				<OrderSummary charges={order.charges} totals={order.totals} />
			</div>
		</div>
	</div>
</section>

<style>
	section {
		padding-top: 36px;
	}

	h1 {
		font-size: clamp(26px, 5.4vw, 36px);
		font-weight: 800;
		color: var(--pink-title);
	}

	.columns {
		display: grid;
		gap: 24px;
		margin-top: 26px;
	}

	@media (min-width: 900px) {
		.columns {
			grid-template-columns: 1fr 1fr;
			align-items: start;
		}
	}

	.panel {
		display: flex;
		flex-direction: column;
		gap: 10px;
		background: var(--surface);
		border: 1px solid #f6d3e0;
		border-radius: var(--radius);
		box-shadow: var(--shadow-card);
		padding: 20px 18px 22px;
	}

	h2 {
		font-size: 21px;
		color: var(--pink-title);
	}

	h2:not(:first-child) {
		margin-top: 12px;
	}

	textarea {
		width: 100%;
		font-family: inherit;
		font-size: 14.5px;
		line-height: 1.5;
		color: var(--ink);
		background: #fff7fa;
		border: 1.5px solid var(--line);
		border-radius: 12px;
		padding: 12px;
		resize: vertical;
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

	.note {
		margin: 0;
		font-size: 14.5px;
		color: var(--muted);
	}
</style>
