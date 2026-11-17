<script lang="ts">
	import { STORE_TIME_ZONE } from '#lib/config.ts';
	import { formatDateTime } from '#lib/format.ts';
	import { ORDER_STEPS } from '#lib/order-status.ts';
	import type { OrderStatus, OrderStatusDates } from '#lib/types.ts';
	import LocalDate from './LocalDate.svelte';
	import Seal from './Seal.svelte';

	type Props = {
		status: OrderStatus;
		dates: OrderStatusDates;
		// O painel mostra as datas no horário do Japão; a loja, no fuso de quem vê.
		storeTime?: boolean;
	};

	let { status, dates, storeTime = false }: Props = $props();

	// Posição do status na sequência. Um pedido cancelado não está em nenhum passo.
	const reached = $derived(ORDER_STEPS.findIndex((step) => step.status === status));
</script>

<!-- Cada passo feito ganha o carimbo com a data em que aconteceu. Pedidos de antes das datas
     por passo mostram só o sinal de conferido. -->
<ol class="progress">
	{#each ORDER_STEPS as step, index (step.status)}
		{@const done = index <= reached}
		{@const date = dates[step.status]}
		<li
			class:done
			class:next={index === reached + 1}
			aria-current={index === reached ? 'step' : undefined}
		>
			<div class="mark">
				{#if done}
					<Seal {date} timeZone={storeTime ? STORE_TIME_ZONE : undefined} size={50} />
				{:else}
					<span class="pending" aria-hidden="true"></span>
				{/if}
			</div>
			<div class="text">
				<h3>
					{step.title}
					<span class="visually-hidden">{done ? '(feito)' : '(ainda não aconteceu)'}</span>
				</h3>
				{#if done && date}
					<p class="when">
						{#if storeTime}{formatDateTime(date)}{:else}<LocalDate {date} />{/if}
					</p>
				{/if}
				<p>{step.text}</p>
			</div>
		</li>
	{/each}
</ol>

<style>
	.progress {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		position: relative;
		display: grid;
		grid-template-columns: 56px 1fr;
		gap: 14px;
		padding-bottom: 22px;
		color: var(--ink-soft);
	}

	li:last-child {
		padding-bottom: 0;
	}

	/* A linha que liga um passo ao seguinte: cheia até onde o pedido chegou, tracejada depois. */
	li:not(:last-child)::before {
		content: '';
		position: absolute;
		top: 54px;
		bottom: 2px;
		left: 27px;
		border-left: 1.5px dashed var(--sakura);
	}

	li.done:not(:last-child):has(+ li.done)::before {
		border-left-style: solid;
		border-left-color: var(--beni);
	}

	.mark {
		display: flex;
		justify-content: center;
		padding-top: 2px;
	}

	.pending {
		width: 34px;
		height: 34px;
		margin-top: 8px;
		border: 1.5px dashed var(--sakura);
		border-radius: 50%;
		background: var(--paper);
	}

	.next .pending {
		border: 2px solid var(--beni);
	}

	.text {
		padding-top: 12px;
	}

	h3 {
		font-size: 1rem;
		color: var(--ink-soft);
	}

	.done h3,
	.next h3 {
		color: var(--ink);
	}

	.when {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--beni);
	}

	p {
		margin-top: 2px;
		font-size: 0.9375rem;
		text-wrap: pretty;
	}
</style>
