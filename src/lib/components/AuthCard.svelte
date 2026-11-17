<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		subtitle?: string;
		children: Snippet;
	};

	let { title, subtitle, children }: Props = $props();
</script>

<div class="wrap auth">
	<img src="/images/site/icone-192.webp" alt="" width="64" height="64" />
	<h1>{title}</h1>
	{#if subtitle}
		<p class="subtitle">{subtitle}</p>
	{/if}

	<div class="content">
		{@render children()}
	</div>
</div>

<style>
	.auth {
		max-width: 400px;
		padding-top: 8vh;
	}

	h1 {
		margin-top: 16px;
		font-size: 1.75rem;
	}

	.subtitle {
		color: var(--ink-soft);
	}

	.content {
		display: grid;
		gap: 20px;
		margin-top: 28px;
	}
</style>
