<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import { ORDER_PROGRESS, ORDER_STATUS_LABELS } from '#lib/order-status.ts';
	import type { OrderStatus } from '#lib/types.ts';

	let { status }: { status: OrderStatus } = $props();

	// Pedido cancelado não está em nenhuma etapa: o índice fica em -1 e nada é marcado.
	const reached = $derived(ORDER_PROGRESS.indexOf(status));
</script>

<ol>
	{#each ORDER_PROGRESS as step, index (step)}
		<li
			class:done={index < reached}
			class:current={index === reached}
			aria-current={index === reached ? 'step' : undefined}
		>
			<span class="marker" aria-hidden="true">
				{#if index < reached}<Check />{:else}{index + 1}{/if}
			</span>
			<span class="label">
				{ORDER_STATUS_LABELS[step]}
				{#if index < reached}<span class="visually-hidden">(concluído)</span>{/if}
			</span>
		</li>
	{/each}
</ol>

<style>
	ol {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
	}

	li {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		text-align: center;
		font-size: 13.5px;
		font-weight: 700;
		line-height: 1.3;
		color: var(--muted);
	}

	/* Linha que liga cada etapa à anterior, por trás dos círculos. */
	li:not(:first-child)::before {
		content: '';
		position: absolute;
		top: 15px;
		right: 50%;
		width: 100%;
		height: 2px;
		background: var(--line);
	}

	li.done::before,
	li.current::before {
		background: var(--pink);
	}

	/* O z-index mantém o círculo por cima da linha que vem da etapa seguinte. */
	.marker {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 2px solid var(--line);
		background: var(--surface);
		font-size: 14px;
		font-weight: 800;
	}

	.marker :global(svg) {
		width: 17px;
		height: 17px;
	}

	.done .marker {
		border-color: var(--pink);
		background: var(--pink);
		color: #ffffff;
	}

	.current .marker {
		border-color: var(--pink-dark);
		color: var(--pink-dark);
	}

	.current .label {
		color: var(--ink-strong);
	}

	.label {
		padding: 0 4px;
	}
</style>
