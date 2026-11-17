<script lang="ts">
	import type { ResolvedPathname } from '$app/types';
	import { formatWaiting } from '#lib/format.ts';
	import type { QueueStatus } from '#lib/types.ts';

	type Props = {
		label: string;
		hint: string;
		queue: QueueStatus;
		href: ResolvedPathname;
		// A fila depende da loja (responder, comprar): com pedidos parados, ela pede atenção.
		needsAction?: boolean;
	};

	let { label, hint, queue, href, needsAction = false }: Props = $props();
</script>

<a class="tile" class:attention={needsAction && queue.count > 0} {href}>
	<span class="count price">{queue.count}</span>
	<span class="label">{label}</span>
	<span class="hint">
		{#if queue.count > 0 && queue.oldestSince}
			O mais antigo está aqui {formatWaiting(queue.oldestSince)}
		{:else}
			{hint}
		{/if}
	</span>
</a>

<style>
	.tile {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-areas:
			'count label'
			'count hint';
		column-gap: 16px;
		align-items: center;
		padding: 16px 18px;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--surface);
		color: var(--ink);
		text-decoration: none;
	}

	.tile:hover {
		border-color: var(--ink-soft);
	}

	.attention {
		border-color: var(--beni);
		box-shadow: inset 4px 0 0 var(--beni);
	}

	.attention:hover {
		border-color: var(--beni-deep);
	}

	.count {
		grid-area: count;
		min-width: 1.6ch;
		font-size: 2.5rem;
		line-height: 1;
		text-align: center;
	}

	.attention .count {
		color: var(--beni);
	}

	.label {
		grid-area: label;
		align-self: end;
		font-weight: 650;
		line-height: 1.3;
	}

	.hint {
		grid-area: hint;
		align-self: start;
		font-size: 0.8125rem;
		color: var(--ink-soft);
	}
</style>
