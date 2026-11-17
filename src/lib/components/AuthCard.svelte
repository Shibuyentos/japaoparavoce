<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		subtitle?: string;
		children: Snippet;
	};

	let { title, subtitle, children }: Props = $props();
</script>

<div class="wrap">
	<div class="auth">
		<img src="/images/site/icone-192.webp" alt="" width="56" height="56" />
		<h1>{title}</h1>
		{#if subtitle}
			<p class="subtitle">{subtitle}</p>
		{/if}

		<div class="content">
			{@render children()}
		</div>
	</div>
</div>

<style>
	.auth {
		max-width: 440px;
		margin: 32px auto 0;
		padding: 28px 20px;
		border: 1px solid var(--line);
		border-radius: var(--radius-l);
		background: var(--surface);
	}

	img {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		box-shadow: 0 0 0 1px var(--line);
	}

	h1 {
		margin-top: 16px;
		font-size: 1.75rem;
	}

	.subtitle {
		margin-top: 6px;
		color: var(--ink-soft);
	}

	.content {
		display: grid;
		gap: 20px;
		margin-top: 24px;
	}

	@media (min-width: 640px) {
		.auth {
			margin-top: 64px;
			padding: 40px;
		}
	}
</style>
