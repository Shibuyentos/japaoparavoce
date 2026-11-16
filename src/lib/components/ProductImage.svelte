<script lang="ts">
	import Camera from '@lucide/svelte/icons/camera';

	type Props = {
		image: string | null;
		name: string;
		eager?: boolean;
	};

	let { image, name, eager = false }: Props = $props();

	// Se o arquivo da foto não existir, mostra o mesmo substituto dos produtos sem foto.
	let failed = $state(false);
</script>

{#if image && !failed}
	<img
		src="/images/products/{image}"
		alt={name}
		loading={eager ? 'eager' : 'lazy'}
		onerror={() => (failed = true)}
	/>
{:else}
	<div class="placeholder" role="img" aria-label="{name}: foto em breve">
		<Camera />
		<span>Foto em breve</span>
	</div>
{/if}

<style>
	img,
	.placeholder {
		width: 100%;
		aspect-ratio: 1 / 1;
		background: #ffffff;
	}

	img {
		object-fit: contain;
		padding: 10px 10px 2px;
	}

	.placeholder {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		background: #fff7fa;
		color: var(--pink-dark);
		font-weight: 800;
		font-size: 14px;
	}

	.placeholder :global(svg) {
		width: 36px;
		height: 36px;
		stroke: var(--gold);
	}
</style>
