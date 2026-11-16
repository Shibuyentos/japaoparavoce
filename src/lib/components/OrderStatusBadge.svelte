<script lang="ts">
	import { ORDER_STATUS_LABELS } from '#lib/order-status.ts';
	import type { OrderStatus } from '#lib/types.ts';

	let { status }: { status: OrderStatus } = $props();
</script>

<span class="badge {status}">{ORDER_STATUS_LABELS[status]}</span>

<style>
	.badge {
		display: inline-block;
		padding: 2px 10px;
		border-radius: 999px;
		border: 1.5px solid;
		font-size: 13px;
		font-weight: 800;
		white-space: nowrap;
	}

	.received {
		background: var(--chip-bg);
		border-color: var(--pink);
		color: var(--pink-dark);
	}

	.quoted {
		background: var(--warn-bg);
		border-color: var(--warn-line);
		color: var(--warn-ink);
	}

	.paid {
		background: #eefaf1;
		border-color: #8fd1a2;
		color: #1f6b35;
	}

	.shipped {
		background: #eef5ff;
		border-color: #9dc0f0;
		color: #1f4f8f;
	}

	.cancelled {
		background: #f4f1f2;
		border-color: #cfc4c8;
		color: #6f6268;
	}
</style>
