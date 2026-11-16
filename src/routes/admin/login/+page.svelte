<script lang="ts">
	import { enhance } from '$app/forms';
	import { STORE_NAME } from '#lib/config.ts';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<svelte:head>
	<title>Entrar · Painel {STORE_NAME}</title>
</svelte:head>

<div class="wrap">
	<form method="POST" use:enhance>
		<img src="/images/site/logo.webp" alt="" width="64" height="64" />
		<h1>Painel da loja</h1>

		{#if form?.message}
			<p class="error" role="alert">{form.message}</p>
		{/if}

		<label for="email">E-mail</label>
		<input
			id="email"
			name="email"
			type="email"
			autocomplete="username"
			required
			value={form?.email ?? ''}
		/>

		<label for="password">Senha</label>
		<input id="password" name="password" type="password" autocomplete="current-password" required />

		<button class="btn btn-primary">Entrar</button>
	</form>
</div>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 8px;
		max-width: 380px;
		margin: 6vh auto 0;
		background: var(--surface);
		border: 1px solid #f6d3e0;
		border-radius: var(--radius);
		box-shadow: var(--shadow-card);
		padding: 28px 24px;
	}

	img {
		border-radius: 18px;
		margin: 0 auto;
	}

	h1 {
		font-size: 24px;
		font-weight: 800;
		text-align: center;
		color: var(--pink-title);
		margin-bottom: 8px;
	}

	label {
		margin-top: 6px;
		font-size: 14.5px;
		font-weight: 800;
	}

	input {
		width: 100%;
		font-family: inherit;
		font-size: 16px;
		color: var(--ink);
		border: 2px solid var(--pink-input);
		border-radius: 12px;
		padding: 10px 12px;
	}

	input:focus {
		outline: none;
		border-color: var(--pink);
		box-shadow: 0 0 0 4px rgba(236, 127, 168, 0.16);
	}

	.error {
		margin: 0;
		background: var(--warn-bg);
		border: 1.5px solid var(--warn-line);
		border-radius: 12px;
		padding: 10px 12px;
		font-size: 15px;
		font-weight: 700;
		color: var(--warn-ink);
	}

	.btn {
		margin-top: 14px;
	}
</style>
