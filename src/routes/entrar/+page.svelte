<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import AuthCard from '#lib/components/AuthCard.svelte';
	import TextField from '#lib/components/TextField.svelte';
	import { STORE_NAME } from '#lib/config.ts';
	import { registerHref } from '#lib/links.ts';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();

	const destination = $derived(page.url.searchParams.get('destino') ?? undefined);
</script>

<svelte:head>
	<title>Entrar · {STORE_NAME}</title>
</svelte:head>

<AuthCard title="Entrar">
	<form class="form" method="POST" use:enhance>
		{#if form?.message}
			<p class="form-alert" role="alert">{form.message}</p>
		{/if}

		<TextField
			name="email"
			label="E-mail"
			type="email"
			autocomplete="username"
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

	<p>Ainda não tem conta? <a href={registerHref(destination)}>Criar conta</a></p>
</AuthCard>

<style>
	p {
		margin: 0;
		text-align: center;
		font-size: 15.5px;
	}

	a {
		font-weight: 700;
	}
</style>
