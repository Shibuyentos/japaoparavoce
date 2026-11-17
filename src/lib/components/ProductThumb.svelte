<script lang="ts">
	import ProductImage from './ProductImage.svelte';

	let { image, name, size = 64 }: { image: string | null; name: string; size?: number } = $props();
</script>

<div class="thumb" style:width="{size}px">
	<ProductImage {image} {name} decorative />
</div>

<style>
	.thumb {
		flex: none;
		overflow: hidden;
		border: 1px solid var(--line);
		border-radius: var(--radius-s);
	}

	.thumb :global(.frame) {
		padding: 6%;
	}

	/* Na miniatura não cabe o texto "Foto em breve", fica só o ícone. */
	.thumb :global(.placeholder span) {
		display: none;
	}

	.thumb :global(.placeholder svg) {
		width: 40%;
		height: 40%;
	}
</style>
