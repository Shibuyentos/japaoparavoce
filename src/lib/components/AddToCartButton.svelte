<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Plus from '@lucide/svelte/icons/plus';
	import { enhance, type SubmitFunction } from '$app/forms';

	type Props = {
		kind: 'product' | 'kit';
		slug: string;
		label?: string;
		// Na grade o botão é menor e diz só "Adicionar": o nome do produto vai para o leitor de tela.
		compactFor?: string;
	};

	let { kind, slug, label = 'Adicionar ao carrinho', compactFor }: Props = $props();

	const FEEDBACK_MS = 1800;

	let added = $state(false);
	let errorMessage = $state('');

	// Com JavaScript a pessoa continua na página onde está e só o contador do cabeçalho muda.
	// Sem JavaScript o formulário é enviado normalmente e o navegador abre o carrinho.
	const submit: SubmitFunction = () => {
		errorMessage = '';

		return async ({ result, update }) => {
			if (result.type === 'failure') {
				errorMessage = String(result.data?.message ?? 'Não foi possível adicionar. Tente de novo.');
				return;
			}

			await update({ navigate: false });
			if (result.type === 'success') {
				added = true;
				setTimeout(() => (added = false), FEEDBACK_MS);
			}
		};
	};
</script>

<form
	method="POST"
	action={kind === 'kit' ? '/carrinho?/addKit' : '/carrinho?/add'}
	use:enhance={submit}
>
	<input type="hidden" name="slug" value={slug} />
	{#if compactFor}
		<button class="compact" class:added>
			{#if added}
				<Check aria-hidden="true" />No carrinho
			{:else}
				<Plus aria-hidden="true" />Adicionar
			{/if}
			<span class="visually-hidden">{compactFor} ao carrinho</span>
		</button>
	{:else}
		<button class="btn btn-primary" class:added>
			{#if added}
				<Check aria-hidden="true" />Adicionado ao carrinho
			{:else}
				<Plus aria-hidden="true" />{label}
			{/if}
		</button>
	{/if}
	<p class="visually-hidden" role="status">{added ? 'Adicionado ao carrinho.' : ''}</p>
	<p class="error" role="alert">{errorMessage}</p>
</form>

<style>
	.btn {
		width: 100%;
	}

	.btn.added {
		background: var(--ok);
	}

	.compact {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		width: 100%;
		min-height: 44px;
		padding: 0 10px;
		border: 1.5px solid var(--line-strong);
		border-radius: 10px;
		background: var(--surface);
		font-family: inherit;
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--ink);
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			border-color 0.15s ease,
			color 0.15s ease;
	}

	.compact:hover {
		border-color: var(--beni);
		color: var(--beni);
	}

	.compact.added {
		border-color: var(--ok);
		background: var(--ok-bg);
		color: var(--ok);
	}

	.compact :global(svg) {
		width: 18px;
		height: 18px;
		stroke-width: 2.4;
	}

	.error {
		margin-top: 6px;
		font-size: 0.8125rem;
		font-weight: 600;
		line-height: 1.35;
		color: var(--danger);
	}

	.error:empty {
		display: none;
	}
</style>
