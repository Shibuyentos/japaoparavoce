<script lang="ts">
	import ProductImage from './ProductImage.svelte';

	let { image, name }: { image: string | null; name: string } = $props();
</script>

<div class="thumb">
	<ProductImage {image} {name} />
</div>

<style>
	.thumb {
		flex: none;
		width: 54px;
		border: 1px solid var(--line-soft);
		border-radius: 10px;
		overflow: hidden;
	}

	.thumb :global(img) {
		padding: 3px;
	}

	/* Na miniatura não cabe o texto "Foto em breve", fica só o ícone. */
	.thumb :global(.placeholder span) {
		display: none;
	}

	.thumb :global(.placeholder svg) {
		width: 22px;
		height: 22px;
	}
</style>
