<script lang="ts">
	import { resolve } from '$app/paths';
	import { INSTAGRAM_HANDLE, INSTAGRAM_URL, STORE_NAME } from '#lib/config.ts';
	import InstagramIcon from './InstagramIcon.svelte';

	const links = [
		{ href: resolve('/vitrine'), label: 'Vitrine' },
		{ href: resolve('/#kits'), label: 'Kits de skincare' },
		{ href: resolve('/#como-funciona'), label: 'Como funciona' },
		{ href: resolve('/#redirecionamento'), label: 'Seu endereço no Japão' },
		{ href: resolve('/#avisos'), label: 'Avisos antes de pedir' },
		{ href: resolve('/conta/pedidos'), label: 'Meus pedidos' }
	];
</script>

<footer>
	<div class="wrap wrap-wide columns">
		<div class="about">
			<p class="name">
				<img src="/images/site/icone-192.webp" alt="" width="48" height="48" loading="lazy" />
				{STORE_NAME}
			</p>
			<!-- O nome da loja em japonês: "do Japão para você". -->
			<p class="japanese" lang="ja">日本からあなたへ</p>
			<p>
				Loja de encomendas do Japão. Produtos novos, comprados nas lojas de lá e enviados com
				rastreio.
			</p>
		</div>

		<nav aria-label="Rodapé">
			<ul>
				{#each links as link (link.href)}
					<li><a href={link.href}>{link.label}</a></li>
				{/each}
			</ul>
		</nav>

		<div class="contact">
			<p>Pedidos, dúvidas e orçamentos são pelo direct do Instagram.</p>
			<a class="instagram" href={INSTAGRAM_URL} target="_blank" rel="external noopener">
				<InstagramIcon />{INSTAGRAM_HANDLE}
			</a>
		</div>
	</div>
</footer>

<style>
	footer {
		margin-top: 72px;
		padding: 40px 0 48px;
		border-top: 2px solid var(--ink);
		font-size: 0.9375rem;
		color: var(--ink-soft);
	}

	.columns {
		display: grid;
		gap: 28px;
	}

	@media (min-width: 760px) {
		.columns {
			grid-template-columns: 1.3fr 1fr 1fr;
			gap: 48px;
		}
	}

	.about p {
		max-width: 38ch;
	}

	.about .name {
		display: flex;
		align-items: center;
		gap: 10px;
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--ink);
	}

	.name img {
		width: 48px;
		height: 48px;
	}

	.japanese {
		margin: 6px 0 10px;
		font-family: 'Hiragino Mincho ProN', 'Yu Mincho', 'Noto Serif CJK JP', serif;
		letter-spacing: 0.12em;
		color: var(--beni);
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li a {
		display: inline-flex;
		align-items: center;
		min-height: 36px;
		color: var(--ink);
		text-decoration: none;
	}

	li a:hover {
		text-decoration: underline;
	}

	.instagram {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 44px;
		margin-top: 6px;
		font-weight: 700;
	}

	.instagram :global(svg) {
		width: 20px;
		height: 20px;
	}
</style>
