<script lang="ts">
	import { resolve } from '$app/paths';
	import ProductThumb from '#lib/components/ProductThumb.svelte';
	import type { ShoppingItem } from '#lib/types.ts';

	let { items }: { items: ShoppingItem[] } = $props();
</script>

{#if items.length === 0}
	<p class="empty">Nenhum pedido pago esperando compra.</p>
{:else}
	<ul>
		{#each items as item (item.slug)}
			<li>
				<ProductThumb image={item.image} name={item.name} size={56} />
				<div class="info">
					<strong>{item.name}</strong>
					<span class="orders">
						{item.orderCodes.length === 1 ? 'Pedido' : 'Pedidos'}
						{#each item.orderCodes as code, index (code)}
							{#if index > 0},
							{/if}<a href={resolve('/admin/pedidos/[code]', { code })}>{code}</a>
						{/each}
					</span>
				</div>
				<span class="quantity price" aria-label="{item.quantity} unidades">×{item.quantity}</span>
			</li>
		{/each}
	</ul>
{/if}

<style>
	.empty {
		padding: 16px 18px;
		border: 1px dashed var(--line-strong);
		border-radius: var(--radius);
		color: var(--ink-soft);
	}

	ul {
		margin: 0;
		padding: 0;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--surface);
		list-style: none;
	}

	li {
		display: grid;
		grid-template-columns: 56px minmax(0, 1fr) auto;
		gap: 14px;
		align-items: center;
		padding: 12px 16px;
	}

	li + li {
		border-top: 1px solid var(--line);
	}

	strong {
		display: block;
		font-size: 0.9375rem;
		font-weight: 600;
		line-height: 1.35;
	}

	.orders {
		font-size: 0.8125rem;
		color: var(--ink-soft);
	}

	.orders a {
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.03em;
	}

	.quantity {
		font-size: 1.5rem;
	}
</style>
