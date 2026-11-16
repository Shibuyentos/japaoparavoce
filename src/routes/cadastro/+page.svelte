<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import AuthCard from '#lib/components/AuthCard.svelte';
	import TextField from '#lib/components/TextField.svelte';
	import { STORE_NAME } from '#lib/config.ts';
	import { loginHref } from '#lib/links.ts';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();

	const destination = $derived(page.url.searchParams.get('destino') ?? undefined);
</script>

<svelte:head>
	<title>Criar conta · {STORE_NAME}</title>
</svelte:head>

<AuthCard title="Criar conta">
	<form class="form" method="POST" use:enhance>
		<TextField
			name="name"
			label="Nome"
			autocomplete="name"
			maxlength={80}
			required
			value={form?.values?.name ?? ''}
			error={form?.errors?.name}
		/>
		<TextField
			name="email"
			label="E-mail"
			type="email"
			autocomplete="email"
			required
			value={form?.values?.email ?? ''}
			error={form?.errors?.email}
		/>
		<TextField
			name="password"
			label="Senha (mínimo de 8 caracteres)"
			type="password"
			autocomplete="new-password"
			minlength={8}
			required
			error={form?.errors?.password}
		/>

		<button class="btn btn-primary">Criar conta</button>
	</form>

	<p>Já tem conta? <a href={loginHref(destination)}>Entrar</a></p>
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
