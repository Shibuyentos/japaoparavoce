<script lang="ts">
	const categories = [
		{
			title: 'Doces e snacks japoneses',
			text: 'Kit Kat de sabores exclusivos, balas, salgadinhos e chocolates do Japão.',
			image: 'snacks.webp',
			alt: 'Caixa cheia de doces e salgadinhos japoneses variados'
		},
		{
			title: 'Anime e colecionáveis',
			text: 'Figures, pelúcias, chaveiros e itens oficiais dos seus animes favoritos.',
			image: 'anime.webp',
			alt: 'Prateleiras de figures e produtos de anime em uma loja no Japão'
		},
		{
			title: 'Games',
			text: 'Jogos e acessórios lançados no Japão, direto das lojas de eletrônicos.',
			image: 'games.jpg',
			alt: 'Prateleira de jogos de Nintendo Switch em uma loja no Japão'
		},
		{
			title: 'Papelaria japonesa',
			text: 'Canetas, cadernos, adesivos e itens de personagens que só têm no Japão.',
			image: 'papelaria.jpg',
			alt: 'Canetas japonesas coloridas com personagens sobre um caderno'
		}
	];
</script>

<section id="categorias">
	<div class="wrap">
		<span class="kicker">Além do skincare</span>
		<h2>Outras categorias que eu encontro pra você</h2>
		<p class="lead">
			A loja é geral: tudo <strong>novo</strong>, comprado em lojas como a Don Quijote — sempre sob
			encomenda.
		</p>

		<div class="grid">
			{#each categories as category (category.title)}
				<article>
					<img src="/images/site/{category.image}" alt={category.alt} loading="lazy" />
					<div class="body">
						<h3>{category.title}</h3>
						<p>{category.text}</p>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
		margin-top: 30px;
	}

	@media (min-width: 860px) {
		.grid {
			grid-template-columns: repeat(4, 1fr);
			gap: 18px;
		}
	}

	article {
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		overflow: hidden;
	}

	img {
		width: 100%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
	}

	@media (min-width: 860px) {
		img {
			aspect-ratio: 4 / 3;
		}
	}

	.body {
		padding: 14px 16px 16px;
	}

	h3 {
		font-size: 17px;
	}

	p {
		margin: 5px 0 0;
		color: var(--muted);
		font-size: 14.5px;
	}
</style>
