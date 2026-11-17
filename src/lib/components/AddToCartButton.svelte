<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Plus from '@lucide/svelte/icons/plus';
	import { enhance, type SubmitFunction } from '$app/forms';

	type Props = {
		kind: 'product' | 'kit';
		slug: string;
		label?: string;
		// Na prateleira o botão é só o "+": o nome do produto entra no texto lido pelo leitor de tela.
		iconOnlyFor?: string;
	};

	let { kind, slug, label = 'Adicionar ao pedido', iconOnlyFor }: Props = $props();

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
	{#if iconOnlyFor}
		<button class="icon" class:added aria-label="Adicionar {iconOnlyFor} ao pedido">
			{#if added}<Check />{:else}<Plus />{/if}
		</button>
	{:else}
		<button class="btn btn-primary">
			{#if added}<Check />Adicionado{:else}<Plus />{label}{/if}
		</button>
	{/if}
	<p class="visually-hidden" role="status">{added ? 'Adicionado ao pedido.' : ''}</p>
	<p class="error" role="alert">{errorMessage}</p>
</form>

<style>
	.btn {
		width: 100%;
	}

	/* Na prateleira o botão pende da linha como a etiqueta de preço, e fica discreto para a foto
	   do produto ser o que chama a atenção. */
	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 46px;
		height: 46px;
		padding: 0;
		border: 1.5px solid var(--ink);
		border-top: none;
		background: var(--white);
		color: var(--beni);
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			color 0.15s ease;
	}

	.icon:hover {
		background: var(--beni);
		color: var(--white);
	}

	.icon.added {
		background: var(--ok);
		color: var(--white);
	}

	.icon :global(svg) {
		width: 22px;
		height: 22px;
		stroke-width: 2.5;
	}

	.error {
		margin-top: 6px;
		font-size: 0.8125rem;
		font-weight: 700;
		line-height: 1.35;
		color: var(--danger);
	}

	.error:empty {
		display: none;
	}
</style>
