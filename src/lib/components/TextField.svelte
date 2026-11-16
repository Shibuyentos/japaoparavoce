<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = HTMLInputAttributes & {
		name: string;
		label: string;
		// Mensagem de validação vinda do servidor.
		error?: string;
	};

	let { name, label, error, ...rest }: Props = $props();

	const id = $props.id();
</script>

<div class="field">
	<label for={id}>{label}</label>
	<input
		{id}
		{name}
		aria-invalid={error ? 'true' : undefined}
		aria-describedby={error ? `${id}-error` : undefined}
		{...rest}
	/>
	{#if error}
		<p id="{id}-error">{error}</p>
	{/if}
</div>

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	label {
		font-size: 14.5px;
		font-weight: 800;
	}

	input {
		width: 100%;
		font-family: inherit;
		font-size: 16px;
		color: var(--ink);
		background: #ffffff;
		border: 2px solid var(--pink-input);
		border-radius: 12px;
		padding: 10px 12px;
	}

	input:focus {
		outline: none;
		border-color: var(--pink);
		box-shadow: 0 0 0 4px rgba(236, 127, 168, 0.16);
	}

	input[aria-invalid='true'] {
		border-color: var(--japan-red);
	}

	p {
		margin: 0;
		font-size: 13.5px;
		font-weight: 700;
		color: var(--japan-red);
	}
</style>
