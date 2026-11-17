<script lang="ts">
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import Equal from '@lucide/svelte/icons/equal';

	type Props = {
		label: string;
		value: string;
		hint?: string;
		// Diferença para o período anterior. Em todos os indicadores do painel, subir é bom.
		change?: number;
		formatChange?: (amount: number) => string;
	};

	let { label, value, hint, change, formatChange = String }: Props = $props();
</script>

<div class="tile">
	<span class="label">{label}</span>
	<span class="value price">{value}</span>

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
</div>

<style>
	.tile {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 16px;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--surface);
	}

	.label {
		font-size: 0.875rem;
		font-weight: 600;
		line-height: 1.3;
		color: var(--ink-soft);
	}

	.value {
		font-size: 1.75rem;
		line-height: 1.2;
	}

	.change {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		font-size: 0.8125rem;
		font-weight: 650;
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
