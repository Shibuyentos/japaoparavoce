<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import AuthCard from '#lib/components/AuthCard.svelte';
	import TextField from '#lib/components/TextField.svelte';
	import { STORE_NAME } from '#lib/config.ts';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<svelte:head>
	<title>Entrar · Painel {STORE_NAME}</title>
</svelte:head>

<AuthCard title="Painel da loja" subtitle="{STORE_NAME}: acesso da administração.">
	<form class="form" method="POST" use:enhance>
		{#if form?.message}
			<p class="notice" role="alert">{form.message}</p>
		{/if}

		<TextField
			name="email"
			label="E-mail"
			type="email"
			autocomplete="username"
			autocapitalize="none"
			spellcheck="false"
			required
			value={form?.email ?? ''}
		/>
		<TextField
			name="password"
			label="Senha"
			type="password"
			autocomplete="current-password"
			required
		/>

		<button class="btn btn-primary">Entrar</button>
	</form>

	<a class="back" href={resolve('/')}>Voltar para a loja</a>
</AuthCard>

<style>
	.back {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		font-size: 0.9375rem;
	}
</style>
