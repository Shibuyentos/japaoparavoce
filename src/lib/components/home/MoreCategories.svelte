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
			image: 'games-640.webp',
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
	<div class="wrap wrap-wide">
		<h2>Além do skincare</h2>
		<p class="lead">
			A loja é geral: tudo <strong>novo</strong>, comprado em lojas como a Don Quijote, sempre sob
			encomenda. Estas categorias não estão na vitrine: me manda o link ou a foto no direct.
		</p>

		<ul>
			{#each categories as category (category.title)}
				<li>
					<img src="/images/site/{category.image}" alt={category.alt} loading="lazy" />
					<h3>{category.title}</h3>
					<p>{category.text}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	section {
		padding-top: 72px;
	}

	ul {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px 14px;
		margin: 24px 0 0;
		padding: 0;
		list-style: none;
	}

	img {
		width: 100%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
	}

	h3 {
		margin-top: 10px;
		font-size: 1rem;
	}

	p:not(.lead) {
		margin-top: 2px;
		font-size: 0.875rem;
		color: var(--ink-soft);
	}

	@media (min-width: 900px) {
		section {
			padding-top: 112px;
		}

		ul {
			grid-template-columns: repeat(4, 1fr);
			gap: 28px;
			margin-top: 40px;
		}

		img {
			aspect-ratio: 4 / 5;
		}
	}
</style>
