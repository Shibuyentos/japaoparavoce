<script lang="ts">
	import Camera from '@lucide/svelte/icons/camera';

	type Props = {
		image: string | null;
		name: string;
		eager?: boolean;
		// Quando o nome do produto já aparece ao lado, a foto não precisa repeti-lo no leitor de tela.
		decorative?: boolean;
	};

	let { image, name, eager = false, decorative = false }: Props = $props();

	// Se o arquivo da foto não existir, mostra o mesmo substituto dos produtos sem foto.
	let failed = $state(false);
</script>

<!-- As fotos vêm de fontes diferentes: umas com fundo branco, outras com fundo colorido. O quadro
     branco com a mesma margem para todas é o que deixa a grade com um ritmo só. -->
<div class="frame">
	{#if image && !failed}
		<img
			src="/images/products/{image}"
			alt={decorative ? '' : name}
			loading={eager ? 'eager' : 'lazy'}
			decoding="async"
			onerror={() => (failed = true)}
		/>
	{:else}
		<div
			class="placeholder"
			role={decorative ? undefined : 'img'}
			aria-label={decorative ? undefined : `${name}: foto em breve`}
			aria-hidden={decorative ? 'true' : undefined}
		>
			<Camera aria-hidden="true" />
			<span>Foto em breve</span>
		</div>
	{/if}
</div>

<style>
	.frame {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		aspect-ratio: 1 / 1;
		padding: 9%;
		background: var(--surface);
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		border-radius: 6px;
	}

	.placeholder {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 100%;
		height: 100%;
		border-radius: var(--radius-s);
		background: var(--paper);
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--ink-soft);
	}

	.placeholder :global(svg) {
		width: 26px;
		height: 26px;
		color: var(--sakura);
	}
</style>
