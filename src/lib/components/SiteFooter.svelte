<script lang="ts">
	import { resolve } from '$app/paths';
	import { INSTAGRAM_HANDLE, INSTAGRAM_URL, STORE_NAME } from '#lib/config.ts';
	import InstagramIcon from './InstagramIcon.svelte';

	const groups = [
		{
			title: 'Loja',
			links: [
				{ href: resolve('/vitrine'), label: 'Vitrine' },
				{ href: resolve('/#kits'), label: 'Kits de skincare' },
				{ href: resolve('/carrinho'), label: 'Carrinho' }
			]
		},
		{
			title: 'Como comprar',
			links: [
				{ href: resolve('/como-funciona'), label: 'Como funciona' },
				{ href: resolve('/como-funciona#valores'), label: 'Fretes e taxas' },
				{ href: resolve('/como-funciona#avisos'), label: 'Antes de pedir' },
				{ href: resolve('/endereco-no-japao'), label: 'Endereço no Japão' }
			]
		},
		{
			title: 'Sua conta',
			links: [
				{ href: resolve('/conta/pedidos'), label: 'Meus pedidos' },
				{ href: resolve('/conta'), label: 'Minha conta' }
			]
		}
	];
</script>

<footer>
	<div class="wrap">
		<div class="top">
			<div class="about">
				<p class="name">
					<img src="/images/site/icone-192.webp" alt="" width="44" height="44" loading="lazy" />
					<span>
						{STORE_NAME}
						<!-- O nome da loja em japonês: "do Japão para você". -->
						<span class="japanese" lang="ja">日本からあなたへ</span>
					</span>
				</p>
				<p>
					Compras sob encomenda nas lojas do Japão. Produtos novos e originais, enviados com
					rastreio pelo correio japonês.
				</p>
				<a class="instagram" href={INSTAGRAM_URL} target="_blank" rel="external noopener">
					<InstagramIcon />
					<span>
						Atendimento pelo direct
						<strong>{INSTAGRAM_HANDLE}</strong>
					</span>
				</a>
			</div>

			{#each groups as group (group.title)}
				<nav aria-label={group.title}>
					<h2>{group.title}</h2>
					<ul>
						{#each group.links as link (link.href)}
							<li><a href={link.href}>{link.label}</a></li>
						{/each}
					</ul>
				</nav>
			{/each}
		</div>

		<p class="fine">
			Preços em iene, como nas lojas do Japão. Os valores em reais usam um câmbio aproximado, só
			para referência.
		</p>
	</div>
</footer>

<style>
	footer {
		margin-top: var(--section-gap);
		padding: 48px 0 40px;
		background: var(--surface);
		border-top: 1px solid var(--line);
		font-size: 0.9375rem;
		color: var(--ink-soft);
	}

	.top {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 32px 24px;
	}

	.about {
		grid-column: 1 / -1;
		display: grid;
		gap: 14px;
		justify-items: start;
		max-width: 40ch;
	}

	.name {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 1.0625rem;
		font-stretch: var(--wide);
		font-weight: 650;
		line-height: 1.25;
		color: var(--ink);
	}

	.name img {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		box-shadow: 0 0 0 1px var(--line);
	}

	.japanese {
		display: block;
		font-size: 0.8125rem;
		font-weight: 400;
		letter-spacing: 0.1em;
		color: var(--beni);
	}

	.instagram {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 44px;
		color: var(--ink);
		text-decoration: none;
	}

	.instagram :global(svg) {
		flex: none;
		width: 22px;
		height: 22px;
		color: var(--beni);
	}

	.instagram strong {
		display: block;
		font-weight: 600;
		color: var(--beni);
	}

	.instagram:hover strong {
		text-decoration: underline;
	}

	h2 {
		margin-bottom: 8px;
		font-size: 0.875rem;
		font-stretch: 100%;
		font-weight: 650;
		letter-spacing: 0;
		color: var(--ink);
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
		color: var(--ink-soft);
		text-decoration: none;
	}

	li a:hover {
		color: var(--ink);
		text-decoration: underline;
	}

	.fine {
		margin-top: 36px;
		padding-top: 20px;
		border-top: 1px solid var(--line);
		font-size: 0.8125rem;
	}

	@media (min-width: 860px) {
		.top {
			grid-template-columns: 1.6fr repeat(3, 1fr);
			gap: 48px;
		}

		.about {
			grid-column: auto;
		}
	}
</style>
