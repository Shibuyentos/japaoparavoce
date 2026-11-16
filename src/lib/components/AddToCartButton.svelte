<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Plus from '@lucide/svelte/icons/plus';
	import { enhance, type SubmitFunction } from '$app/forms';

	type Props = {
		kind: 'product' | 'kit';
		slug: string;
		label?: string;
		compact?: boolean;
	};

	let { kind, slug, label = 'Adicionar ao pedido', compact = false }: Props = $props();

	const FEEDBACK_MS = 1600;

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
	<button class="btn btn-primary" class:compact>
		{#if added}
			<Check />Adicionado
		{:else}
			<Plus />{label}
		{/if}
	</button>
	<p class="error" role="alert">{errorMessage}</p>
</form>

<style>
	button {
		width: 100%;
	}

	.compact {
		font-size: 14.5px;
		padding: 9px 10px;
		border-radius: 12px;
		gap: 6px;
	}

	.compact :global(svg) {
		width: 17px;
		height: 17px;
	}

	.error {
		margin: 6px 0 0;
		font-size: 13.5px;
		font-weight: 700;
		color: var(--japan-red);
	}

	.error:empty {
		display: none;
	}
</style>
