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
	<SiteHeader cartItemCount={data.cartItemCount} user={data.user} />

	<main>
		{@render children()}
	</main>

	<SiteFooter />
{/if}
