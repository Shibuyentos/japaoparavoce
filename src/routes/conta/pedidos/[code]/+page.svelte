<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Check from '@lucide/svelte/icons/check';
	import Copy from '@lucide/svelte/icons/copy';
	import { resolve } from '$app/paths';
	import InstagramIcon from '#lib/components/InstagramIcon.svelte';
	import LocalDate from '#lib/components/LocalDate.svelte';
	import OrderProgress from '#lib/components/OrderProgress.svelte';
	import OrderStatusBadge from '#lib/components/OrderStatusBadge.svelte';
	import OrderSummary from '#lib/components/OrderSummary.svelte';
	import { INSTAGRAM_HANDLE, INSTAGRAM_URL, STORE_NAME } from '#lib/config.ts';
	import { formatJpy } from '#lib/format.ts';
	import { orderSummaryText } from '#lib/order-summary.ts';
	import type { OrderStatus } from '#lib/types.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const order = $derived(data.order);
	const summaryText = $derived(orderSummaryText(order));

	// O que a cliente precisa saber ou fazer em cada momento do pedido.
	const nextSteps: Record<OrderStatus, { title: string; text: string }> = {
		received: {
			title: 'Agora envie o resumo no direct',
			text: 'É na conversa do Instagram que eu confirmo os valores e a gente combina o pagamento.'
		},
		quoted: {
			title: 'Orçamento enviado',
			text: 'Confira o orçamento que mandei no direct do Instagram. O pagamento é combinado por lá.'
		},
		paid: {
			title: 'Pagamento confirmado',
			text: 'Vou até a loja comprar os seus produtos e aviso assim que a caixa for postada.'
		},
		shipped: {
			title: 'Pedido enviado',
			text: 'Sua caixa já foi postada. O código de rastreio está na nossa conversa do direct.'
		},
		cancelled: {
			title: 'Pedido cancelado',
			text: 'Este pedido foi cancelado. Se ficou alguma dúvida, é só chamar no direct.'
		}
	};
	const nextStep = $derived(nextSteps[order.status]);

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

<svelte:head>
	<title>Pedido {order.code} · {STORE_NAME}</title>
</svelte:head>

<a class="back" href={resolve('/conta/pedidos')}><ArrowLeft />Meus pedidos</a>

<div class="title">
	<h1>Pedido {order.code}</h1>
	<OrderStatusBadge status={order.status} />
</div>
<p class="date">Feito em <LocalDate date={order.createdAt} /></p>

{#if order.status !== 'cancelled'}
	<div class="progress panel">
		<OrderProgress status={order.status} />
	</div>
{/if}

<div class="columns">
	<div class="panel step">
		<h2>{nextStep.title}</h2>
		<p>{nextStep.text}</p>

		{#if order.status === 'received'}
			<textarea
				bind:this={summaryField}
				readonly
				rows="10"
				aria-label="Resumo do pedido"
				value={summaryText}></textarea>
			<button class="btn btn-primary" type="button" onclick={copySummary}>
				{#if copied}
					<Check />Copiado! Agora cole no Instagram
				{:else}
					<Copy />Copiar resumo do pedido
				{/if}
			</button>
		{/if}

		<a class="btn btn-ghost" href={INSTAGRAM_URL} target="_blank" rel="external noopener">
			<InstagramIcon />Abrir o Instagram {INSTAGRAM_HANDLE}
		</a>
	</div>

	<div class="panel">
		<h2>Itens do pedido</h2>
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
		font-size: clamp(24px, 5vw, 32px);
		font-weight: 800;
		color: var(--pink-title);
	}

	.date {
		margin: 4px 0 0;
		font-size: 14.5px;
		color: var(--muted);
	}

	.progress {
		margin-top: 20px;
		padding: 20px 10px 18px;
	}

	.columns {
		display: grid;
		gap: 18px;
		margin-top: 18px;
	}

	@media (min-width: 900px) {
		.columns {
			grid-template-columns: 1fr 1fr;
			align-items: start;
		}
	}

	.panel:not(.progress) {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	h2 {
		font-size: 20px;
		color: var(--ink-strong);
	}

	.step p {
		margin: 0;
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
