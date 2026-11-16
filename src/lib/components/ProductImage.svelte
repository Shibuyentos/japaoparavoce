<script lang="ts">
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

<!-- O produto fica "em pé": a foto encosta na base do quadro, onde passa a linha da prateleira. -->
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
			<span>Foto em breve</span>
		</div>
	{/if}
</div>

<style>
	/* A maioria das fotos tem fundo branco: multiplicar a cor da foto pela do papel faz esse branco
	   sumir, sem recortar nenhuma imagem. O fundo fica no próprio quadro porque a mistura só
	   enxerga o que está no mesmo contexto de empilhamento. */
	.frame {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		width: 100%;
		aspect-ratio: 1 / 1;
		background: var(--paper);
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: center bottom;
		mix-blend-mode: multiply;
	}

	.placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 56%;
		height: 72%;
		padding: 6px;
		border: 1.5px dashed var(--sakura);
		border-bottom: none;
		background: var(--white);
		font-size: 0.75rem;
		font-weight: 500;
		line-height: 1.3;
		text-align: center;
		color: var(--ink-soft);
	}
</style>
