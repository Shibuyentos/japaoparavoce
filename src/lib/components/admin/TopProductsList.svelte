<script lang="ts">
	import type { TopProduct } from '#lib/types.ts';

	let { products }: { products: TopProduct[] } = $props();

	// A lista já chega ordenada, do produto mais pedido para o menos pedido.
	const highest = $derived(products[0]?.quantity ?? 0);
</script>

{#if products.length === 0}
	<p class="empty">Ainda não há produtos pedidos no período.</p>
{:else}
	<ol>
		{#each products as product (product.slug)}
			<li>
				<span class="name">{product.name}</span>
				<span class="row">
					<span class="bar" style:--share={product.quantity / highest} aria-hidden="true"></span>
					<span class="quantity">
						{product.quantity}
						<span class="visually-hidden">{product.quantity === 1 ? 'unidade' : 'unidades'}</span>
					</span>
				</span>
			</li>
		{/each}
	</ol>
{/if}

<style>
	.empty {
		margin: 0;
		color: var(--ink-soft);
	}

	ol {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 12px;
	}

	.name {
		display: block;
		font-size: 14.5px;
		font-weight: 500;
		line-height: 1.35;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 4px;
	}

	/* A barra maior deixa espaço para o número, que fica sempre na ponta dela. */
	.bar {
		width: calc((100% - 44px) * var(--share));
		min-width: 3px;
		height: 8px;
		border-radius: 0 2px 2px 0;
		background: var(--beni);
	}

	.quantity {
		font-size: 14px;
		font-weight: 700;
	}
</style>
