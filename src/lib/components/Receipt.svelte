<script lang="ts">
	import type { Snippet } from 'svelte';
	import { STORE_NAME } from '#lib/config.ts';

	let { children }: { children: Snippet } = $props();
</script>

<!-- A nota da loja: o mesmo papel aparece na página inicial, no carrinho, no pedido e no painel.
     As linhas são listas de definição (dl): nome do valor, pontilhado e valor. -->
<div class="receipt">
	<div class="paper">
		<p class="store">
			{STORE_NAME}
			<span lang="ja">日本からあなたへ</span>
		</p>
		{@render children()}
	</div>
</div>

<style>
	/* A sombra fica no elemento de fora porque o recorte do papel esconderia uma sombra própria. */
	.receipt {
		filter: drop-shadow(0 1px 1px rgb(90 30 52 / 0.1)) drop-shadow(0 10px 16px rgb(90 30 52 / 0.1));
	}

	/* Borda de baixo serrilhada, como papel de recibo destacado. */
	.paper {
		padding: 18px 18px 30px;
		background: var(--surface);
		font-variant-numeric: tabular-nums;
		mask: conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% / 14px 100%;
	}

	.store {
		margin-bottom: 12px;
		padding-bottom: 12px;
		border-bottom: 1.5px dashed var(--line-strong);
		font-size: 0.875rem;
		font-stretch: var(--wide);
		font-weight: 650;
		text-align: center;
	}

	.store span {
		display: block;
		font-size: 0.75rem;
		font-weight: 400;
		letter-spacing: 0.12em;
		color: var(--ink-soft);
	}

	.paper :global(dl) {
		margin: 0;
	}

	.paper :global(dl > div) {
		display: flex;
		align-items: baseline;
		gap: 8px;
		padding: 5px 0;
		font-size: 0.9375rem;
	}

	/* O pontilhado liga o nome ao valor, como em uma nota impressa. */
	.paper :global(dt) {
		flex: 1;
		display: flex;
		align-items: baseline;
		gap: 8px;
		min-width: 0;
	}

	.paper :global(dt::after) {
		content: '';
		flex: 1;
		min-width: 12px;
		border-bottom: 1.5px dotted var(--sakura);
		transform: translateY(-4px);
	}

	.paper :global(dd) {
		flex: none;
		margin: 0;
		font-weight: 600;
		white-space: nowrap;
	}
</style>
