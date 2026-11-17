<script lang="ts">
	import { ORDER_STATUS_LABELS } from '#lib/order-status.ts';
	import type { OrderStatus } from '#lib/types.ts';

	let { status }: { status: OrderStatus } = $props();
</script>

<span class="badge {status}">{ORDER_STATUS_LABELS[status]}</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 2px 10px 2px 8px;
		border-radius: 999px;
		font-size: 0.8125rem;
		font-weight: 600;
		line-height: 1.5;
		white-space: nowrap;
	}

	/* O ponto repete a cor do status para quem não distingue bem o fundo. */
	.badge::before {
		content: '';
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: currentColor;
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
