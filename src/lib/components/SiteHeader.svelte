<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { INSTAGRAM_URL, STORE_NAME } from '#lib/config.ts';
	import InstagramIcon from './InstagramIcon.svelte';

	const links = [
		{ href: resolve('/vitrine'), label: 'Vitrine', hideOnMobile: false },
		{ href: resolve('/#kits'), label: 'Kits', hideOnMobile: false },
		{ href: resolve('/#como-funciona'), label: 'Como funciona', hideOnMobile: true }
	];
</script>

<header class="site-header">
	<div class="wrap bar">
		<!-- No celular só o logo aparece, então o nome acessível vem do aria-label. -->
		<a class="brand" href={resolve('/')} aria-label={STORE_NAME}>
			<img src="/images/site/logo.webp" alt="" width="40" height="40" />
			<span>{STORE_NAME}</span>
		</a>

		<nav aria-label="Principal">
			{#each links as link (link.href)}
				<a
					href={link.href}
					class:hide-mobile={link.hideOnMobile}
					aria-current={page.url.pathname.startsWith(link.href) ? 'page' : undefined}
				>
					{link.label}
				</a>
			{/each}
			<a
				class="instagram"
				href={INSTAGRAM_URL}
				target="_blank"
				rel="external noopener"
				aria-label="Instagram"
			>
				<InstagramIcon />
				<span class="hide-mobile">Instagram</span>
			</a>
		</nav>
	</div>
</header>

<style>
	.site-header {
		border-bottom: 1px solid var(--line);
		background: var(--surface);
	}

	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		min-height: 64px;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		color: var(--ink);
		font-weight: 800;
		font-size: 17px;
	}

	.brand img {
		width: 40px;
		height: 40px;
		border-radius: 12px;
		object-fit: cover;
	}

	nav {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	nav a {
		text-decoration: none;
		color: var(--ink);
		font-weight: 700;
		font-size: 15.5px;
		padding: 8px 12px;
		border-radius: 999px;
	}

	nav a:hover,
	nav a[aria-current='page'] {
		color: var(--pink-dark);
		background: var(--chip-bg);
	}

	.instagram {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		background: var(--pink);
		color: #ffffff;
		margin-left: 4px;
	}

	nav .instagram:hover {
		background: var(--pink-dark);
		color: #ffffff;
	}

	.instagram :global(svg) {
		width: 18px;
		height: 18px;
	}

	@media (max-width: 639px) {
		.brand span,
		.hide-mobile {
			display: none;
		}
	}
</style>
