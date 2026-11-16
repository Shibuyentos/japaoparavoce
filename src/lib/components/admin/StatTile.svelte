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
	};

	let { label, value, hint, change, formatChange = String, href }: Props = $props();
</script>

<svelte:element this={href ? 'a' : 'div'} class="tile" {href}>
	<span class="label">
		{label}
		{#if href}<ArrowRight />{/if}
	</span>
	<span class="value">{value}</span>

	{#if change !== undefined}
		<span class="change" class:up={change > 0} class:down={change < 0}>
			{#if change > 0}
				<ArrowUp />+{formatChange(change)}
			{:else if change < 0}
				<ArrowDown />−{formatChange(-change)}
			{:else}
				<Equal />igual
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
		padding: 14px 16px 16px;
		background: var(--surface);
		border: 1px solid #f6d3e0;
		border-radius: 16px;
		color: var(--ink);
		text-decoration: none;
	}

	a.tile:hover {
		border-color: var(--pink);
	}

	.label {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		font-size: 14px;
		font-weight: 700;
		color: var(--muted);
	}

	.label :global(svg) {
		width: 16px;
		height: 16px;
		flex: none;
	}

	a.tile:hover .label :global(svg) {
		color: var(--pink-dark);
	}

	.value {
		font-size: 28px;
		font-weight: 800;
		line-height: 1.2;
		color: var(--ink-strong);
	}

	@media (max-width: 639px) {
		.tile {
			padding: 12px 12px 14px;
		}

		.value {
			font-size: 23px;
		}
	}

	.change {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		font-size: 13.5px;
		font-weight: 800;
		color: var(--muted);
	}

	.change :global(svg) {
		width: 15px;
		height: 15px;
	}

	.up {
		color: #1f6b35;
	}

	.down {
		color: var(--japan-red);
	}

	.hint {
		font-size: 13.5px;
		color: var(--muted);
	}
</style>
