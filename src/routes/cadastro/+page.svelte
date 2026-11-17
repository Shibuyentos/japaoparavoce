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

<AuthCard
	title="Criar conta"
	subtitle="Com a conta você envia pedidos e acompanha cada passo, do orçamento ao rastreio."
>
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
			autocapitalize="none"
			spellcheck="false"
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

	<p class="other">Já tem conta? <a href={loginHref(destination)}>Entrar</a></p>
</AuthCard>

<style>
	.other {
		font-size: 0.9375rem;
	}

	.other a {
		font-weight: 700;
	}
</style>
