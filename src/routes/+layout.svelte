<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import SiteFooter from '#lib/components/SiteFooter.svelte';
	import SiteHeader from '#lib/components/SiteHeader.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	// O painel tem cabeçalho próprio, em routes/admin/+layout.svelte.
	const isAdmin = $derived(page.route.id?.startsWith('/admin') ?? false);
</script>

{#if isAdmin}
	{@render children()}
{:else}
	<a class="skip" href="#conteudo">Pular para o conteúdo</a>
	<SiteHeader cartItemCount={data.cartItemCount} user={data.user} />

	<main id="conteudo">
		{@render children()}
	</main>

	<SiteFooter />
{/if}

<style>
	/* Só aparece quando recebe o foco do teclado. */
	.skip {
		position: absolute;
		top: 8px;
		left: 8px;
		z-index: 20;
		padding: 10px 14px;
		background: var(--ink);
		font-weight: 700;
		color: var(--white);
		transform: translateY(-200%);
	}

	.skip:focus {
		transform: none;
	}
</style>
