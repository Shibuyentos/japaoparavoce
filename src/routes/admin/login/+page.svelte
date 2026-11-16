<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { STORE_NAME } from '#lib/config.ts';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<svelte:head>
	<title>Entrar · Painel {STORE_NAME}</title>
</svelte:head>

<div class="wrap login">
	<img src="/images/site/icone-192.webp" alt="" width="64" height="64" />
	<h1>Painel da loja</h1>
	<p class="store">{STORE_NAME}</p>

	<form method="POST" use:enhance>
		{#if form?.message}
			<p class="notice" role="alert">{form.message}</p>
		{/if}

		<div>
			<label for="email">E-mail</label>
			<input
				id="email"
				name="email"
				type="email"
				autocomplete="username"
				autocapitalize="none"
				spellcheck="false"
				required
				value={form?.email ?? ''}
			/>
		</div>

		<div>
			<label for="password">Senha</label>
			<input
				id="password"
				name="password"
				type="password"
				autocomplete="current-password"
				required
			/>
		</div>

		<button class="btn btn-primary">Entrar</button>
	</form>

	<a class="back" href={resolve('/')}>Voltar para a loja</a>
</div>

<style>
	.login {
		max-width: 400px;
		padding-top: 8vh;
	}

	h1 {
		margin-top: 16px;
		font-size: 1.75rem;
	}

	.store {
		color: var(--ink-soft);
	}

	form {
		display: grid;
		gap: 16px;
		margin-top: 28px;
	}

	label {
		margin-bottom: 6px;
	}

	.btn {
		margin-top: 4px;
	}

	.back {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		margin-top: 20px;
		font-size: 0.9375rem;
	}
</style>
