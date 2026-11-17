<script lang="ts">
	import { ORDER_STATUS_LABELS } from '#lib/order-status.ts';
	import type { OrderStatus } from '#lib/types.ts';

	let { status }: { status: OrderStatus } = $props();
</script>

<span class="badge {status}">{ORDER_STATUS_LABELS[status]}</span>

<style>
	.badge {
		display: inline-block;
		padding: 2px 8px;
		border-radius: 3px;
		font-size: 0.8125rem;
		font-weight: 700;
		line-height: 1.5;
		white-space: nowrap;
	}

	.received {
		background: var(--blush);
		color: var(--beni-deep);
	}

	.quoted {
		background: var(--warn-bg);
		color: var(--warn);
	}

	.paid {
		background: var(--ok-bg);
		color: var(--ok);
	}

	.shipped {
		background: var(--info-bg);
		color: var(--info);
	}

	.cancelled {
		background: var(--neutral-bg);
		color: var(--neutral);
	}
</style>
