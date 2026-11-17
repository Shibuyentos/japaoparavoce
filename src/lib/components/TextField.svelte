<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = HTMLInputAttributes & {
		name: string;
		label: string;
		// Explicação curta que fica sempre visível embaixo do campo.
		hint?: string;
		// Mensagem de validação vinda do servidor.
		error?: string;
	};

	let { name, label, hint, error, ...rest }: Props = $props();

	const id = $props.id();

	const describedBy = $derived(
		[error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined
	);
</script>

<div>
	<label for={id}>{label}</label>
	<input
		{id}
		{name}
		aria-invalid={error ? 'true' : undefined}
		aria-describedby={describedBy}
		{...rest}
	/>
	{#if hint}
		<p class="hint" id="{id}-hint">{hint}</p>
	{/if}
	{#if error}
		<p class="field-error" id="{id}-error">{error}</p>
	{/if}
</div>

<style>
	label {
		margin-bottom: 6px;
	}

	.hint {
		margin-top: 4px;
		font-size: 0.8125rem;
		color: var(--ink-soft);
	}
</style>
