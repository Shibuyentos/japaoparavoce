<script lang="ts">
	import Package from '@lucide/svelte/icons/package';
	import { weightBandLabel } from '#lib/format.ts';

	let { grams }: { grams: number } = $props();
</script>

<span class="weight-chip">
	<Package />
	{weightBandLabel(grams)}
</span>

<style>
	.weight-chip {
		align-self: flex-start;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 12.5px;
		font-weight: 700;
		border: 1.5px dashed var(--pink);
		color: var(--pink-dark);
		border-radius: 999px;
		padding: 2px 10px;
	}

	.weight-chip :global(svg) {
		width: 15px;
		height: 15px;
	}
</style>
