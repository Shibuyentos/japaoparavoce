<script lang="ts">
	import { INSTAGRAM_URL, STORE_NAME } from '#lib/config.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Acompanhar pedido · {STORE_NAME}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="wrap page">
	<h1>Acompanhar pedido</h1>
	<p class="lead">
		Digite o código do seu pedido. Ele aparece na tela quando você envia o pedido e também no resumo
		que você mandou no direct.
	</p>

	<form method="GET">
		<label for="codigo">Código do pedido</label>
		<div class="row">
			<input
				id="codigo"
				name="codigo"
				value={data.typed}
				placeholder="Ex.: K7MP2XQ9"
				autocomplete="off"
				autocapitalize="characters"
				spellcheck="false"
				maxlength="20"
				required
				aria-invalid={data.notFound ? 'true' : undefined}
				aria-describedby={data.notFound ? 'codigo-erro' : undefined}
			/>
			<button class="btn btn-primary">Ver pedido</button>
		</div>
		{#if data.notFound}
			<p class="field-error" id="codigo-erro">
				Não encontrei pedido com esse código. Confira as 8 letras e números e tente de novo.
			</p>
		{/if}
	</form>

	<p class="help">
		Não achou o código? <a href={INSTAGRAM_URL} target="_blank" rel="external noopener"
			>Me chama no direct</a
		> que eu localizo o seu pedido.
	</p>
</div>

<style>
	.page {
		max-width: 640px;
		padding-top: 40px;
	}

	form {
		margin-top: 28px;
	}

	.row {
		display: grid;
		gap: 10px;
		margin-top: 6px;
	}

	input {
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	input::placeholder {
		letter-spacing: 0;
		text-transform: none;
	}

	.help {
		margin-top: 28px;
		font-size: 0.9375rem;
		color: var(--ink-soft);
	}

	@media (min-width: 520px) {
		.row {
			grid-template-columns: 1fr auto;
		}
	}
</style>
