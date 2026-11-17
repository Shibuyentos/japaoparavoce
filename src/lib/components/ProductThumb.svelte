<script lang="ts">
	import ProductImage from './ProductImage.svelte';

	let { image, name }: { image: string | null; name: string } = $props();
</script>

<div class="thumb">
	<ProductImage {image} {name} decorative />
</div>

<style>
	.thumb {
		flex: none;
		width: 64px;
		border-bottom: 2px solid var(--ink);
	}

	/* Na miniatura não cabe o texto "Foto em breve", fica só o contorno. */
	.thumb :global(.placeholder span) {
		display: none;
	}
</style>
