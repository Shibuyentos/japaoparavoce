<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import { ORDER_STEPS } from '#lib/order-status.ts';
	import type { OrderStatus } from '#lib/types.ts';

	let { status }: { status: OrderStatus } = $props();

	// Posição do status na sequência. Um pedido cancelado não está em nenhum passo.
	const reached = $derived(ORDER_STEPS.findIndex((step) => step.status === status));
</script>

<ol class="progress">
	{#each ORDER_STEPS as step, index (step.status)}
		{@const done = index <= reached}
		<li
			class:done
			class:next={index === reached + 1}
			aria-current={index === reached ? 'step' : undefined}
		>
			<span class="mark" aria-hidden="true">
				{#if done}<Check />{/if}
			</span>
			<div>
				<h3>
					{step.title}
					<span class="visually-hidden">{done ? '(concluído)' : '(ainda não aconteceu)'}</span>
				</h3>
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
		grid-template-columns: 28px 1fr;
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
		top: 28px;
		bottom: 0;
		left: 13px;
		border-left: 2px dashed var(--sakura);
	}

	li.done:not(:last-child):has(+ li.done)::before {
		border-left-style: solid;
		border-left-color: var(--beni);
	}

	.mark {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border: 2px solid var(--sakura);
		border-radius: 50%;
		background: var(--paper);
	}

	.done .mark {
		border-color: var(--beni);
		background: var(--beni);
		color: var(--white);
	}

	.next .mark {
		border-color: var(--beni);
	}

	.mark :global(svg) {
		width: 16px;
		height: 16px;
		stroke-width: 3;
	}

	h3 {
		padding-top: 2px;
		font-size: 1rem;
	}

	.done h3 {
		color: var(--ink);
	}

	p {
		margin-top: 2px;
		font-size: 0.9375rem;
	}
</style>
