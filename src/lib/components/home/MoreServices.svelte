<script lang="ts">
	import { resolve } from '$app/paths';
	import InstagramIcon from '#lib/components/InstagramIcon.svelte';
	import { INSTAGRAM_URL } from '#lib/config.ts';

	// Categorias que não estão na vitrine, mas que eu compro sob encomenda.
	const categories = [
		{ name: 'Doces e snacks', image: 'snacks.webp', alt: 'Doces e salgadinhos japoneses' },
		{ name: 'Anime', image: 'anime.webp', alt: 'Figures e produtos de anime numa loja' },
		{ name: 'Games', image: 'games-640.webp', alt: 'Jogos de Nintendo Switch numa loja' },
		{ name: 'Papelaria', image: 'papelaria.jpg', alt: 'Canetas japonesas com personagens' }
	];
</script>

<section class="more" aria-label="Outros serviços">
	<div class="wrap layout">
		<div class="panel">
			<h2>Seu endereço no Japão</h2>
			<p>
				Achou uma loja japonesa que não entrega fora do país? Mande entregar no meu endereço: eu
				recebo, confiro com foto e reenvio pra você com rastreio.
			</p>
			<a class="btn btn-quiet" href={resolve('/endereco-no-japao')}>Como funciona o reenvio</a>
		</div>

		<div class="panel">
			<h2>Além do skincare</h2>
			<p>
				Doces, colecionáveis de anime, games e papelaria também vêm sob encomenda. Me mande o link
				ou a foto do que você quer no direct.
			</p>
			<ul>
				{#each categories as category (category.name)}
					<li>
						<img src="/images/site/{category.image}" alt={category.alt} loading="lazy" />
						<span>{category.name}</span>
					</li>
				{/each}
			</ul>
			<a class="btn btn-quiet" href={INSTAGRAM_URL} target="_blank" rel="external noopener">
				<InstagramIcon />Pedir no direct
			</a>
		</div>
	</div>
</section>

<style>
	.more {
		margin-top: var(--section-gap);
	}

	.layout {
		display: grid;
		gap: 16px;
	}

	.panel {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 14px;
		padding: 24px 20px;
		border-radius: var(--radius-l);
		background: var(--blush);
	}

	h2 {
		font-size: clamp(1.375rem, 4.6vw, 1.75rem);
	}

	p {
		max-width: 52ch;
		color: var(--ink-soft);
	}

	ul {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 8px;
		width: 100%;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li img {
		width: 100%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
		border-radius: var(--radius-s);
	}

	li span {
		display: block;
		margin-top: 6px;
		font-size: 0.8125rem;
		font-weight: 500;
		line-height: 1.3;
	}

	.btn {
		margin-top: auto;
	}

	@media (min-width: 900px) {
		.layout {
			grid-template-columns: 1fr 1fr;
			gap: 24px;
		}

		.panel {
			padding: 36px;
		}
	}
</style>
