<script lang="ts">
	import '../app.css';
	import SiteFooter from '#lib/components/SiteFooter.svelte';
	import SiteHeader from '#lib/components/SiteHeader.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<SiteHeader cartItemCount={data.cartItemCount} />

<main>
	{@render children()}
</main>

<SiteFooter />
