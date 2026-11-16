<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title, children }: { title: string; children: Snippet } = $props();
</script>

<div class="wrap">
	<div class="card panel">
		<img src="/images/site/logo.webp" alt="" width="64" height="64" />
		<h1>{title}</h1>
		{@render children()}
	</div>
</div>

<style>
	.card {
		display: flex;
		flex-direction: column;
		gap: 14px;
		max-width: 400px;
		margin: 6vh auto 0;
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
	}
</style>
