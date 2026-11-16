<script lang="ts">
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import Equal from '@lucide/svelte/icons/equal';
	import type { ResolvedPathname } from '$app/types';

	type Props = {
		label: string;
		value: string;
		hint?: string;
		// Diferença para o período anterior. Em todos os indicadores do painel, subir é bom.
		change?: number;
		formatChange?: (amount: number) => string;
		href?: ResolvedPathname;
		// Destaca o número: usado na fila quando há pedidos esperando uma ação.
		highlight?: boolean;
	};

	let {
		label,
		value,
		hint,
		change,
		formatChange = String,
		href,
		highlight = false
	}: Props = $props();
</script>

<svelte:element this={href ? 'a' : 'div'} class="tile" class:highlight {href}>
	<span class="label">
		{label}
		{#if href}<ArrowRight aria-hidden="true" />{/if}
	</span>
	<span class="value">{value}</span>

	{#if change !== undefined}
		<span class="change" class:up={change > 0} class:down={change < 0}>
			{#if change > 0}
				<ArrowUp aria-hidden="true" />+{formatChange(change)}
			{:else if change < 0}
				<ArrowDown aria-hidden="true" />−{formatChange(-change)}
			{:else}
				<Equal aria-hidden="true" />igual
			{/if}
			<span class="visually-hidden">em relação ao período anterior</span>
		</span>
	{/if}

	{#if hint}
		<span class="hint">{hint}</span>
	{/if}
</svelte:element>

<style>
	.tile {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 12px 0 4px;
		border-top: 2px solid var(--ink);
		color: var(--ink);
		text-decoration: none;
	}

	a.tile:hover .label {
		text-decoration: underline;
	}

	.label {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		font-size: 0.875rem;
		font-weight: 700;
		line-height: 1.3;
	}

	.label :global(svg) {
		flex: none;
		width: 16px;
		height: 16px;
		color: var(--beni);
	}

	.value {
		font-family: var(--font-display);
		font-size: 1.75rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		line-height: 1.2;
	}

	.highlight .value {
		color: var(--beni);
	}

	.change {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		font-size: 0.8125rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		color: var(--ink-soft);
	}

	.change :global(svg) {
		width: 15px;
		height: 15px;
	}

	.up {
		color: var(--ok);
	}

	.down {
		color: var(--danger);
	}

	.hint {
		font-size: 0.8125rem;
		color: var(--ink-soft);
	}
</style>
