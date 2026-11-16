<script lang="ts">
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import Steps from '#lib/components/Steps.svelte';

	const steps = [
		{
			title: 'Peça meu endereço no direct',
			text: 'Antes de comprar, me chama no Instagram: eu te passo o meu endereço no Japão na conversa — ele não fica publicado aqui, é só pra clientes.'
		},
		{
			title: 'Compra na loja que você quiser',
			text: 'Faz a sua compra normalmente no site da loja japonesa e coloca o meu endereço como endereço de entrega.'
		},
		{
			title: 'Eu recebo e confiro com foto',
			text: 'Quando a sua compra chegar aqui em casa, eu confiro tudo e te mando foto do que chegou, antes de reenviar.'
		},
		{
			title: 'Reenvio pra sua casa, com rastreio',
			text: 'Junto suas compras numa caixa só, embalo com cuidado, posto no correio e te mando o código de rastreio.'
		}
	];

	const shops = [
		{
			name: 'Qoo10',
			url: 'https://www.qoo10.jp/',
			note: 'Skincare coreano e japonês, com cupons e promoções toda hora'
		},
		{
			name: 'Uniqlo',
			url: 'https://www.uniqlo.com/jp/ja/',
			note: 'Básicos de qualidade e peças que só vendem no Japão'
		},
		{
			name: 'GU',
			url: 'https://www.gu-global.com/jp/ja/',
			note: 'Moda jovem da família Uniqlo, com preço que cabe no bolso'
		},
		{
			name: 'Nike',
			url: 'https://www.nike.com/jp/',
			note: 'Tênis, roupas e lançamentos da loja oficial japonesa'
		},
		{
			name: 'New Balance',
			url: 'https://shop.newbalance.jp/shop/',
			note: 'Tênis da loja oficial japonesa, incluindo modelos limitados'
		},
		{
			name: 'Amazon JP',
			url: 'https://www.amazon.co.jp/',
			note: 'De tudo um pouco: beleza, eletrônicos, brinquedos e muito mais'
		},
		{
			name: 'Rakuten',
			url: 'https://www.rakuten.co.jp/',
			note: 'Milhares de lojinhas japonesas num marketplace só'
		}
	];
</script>

<section id="redirecionamento" class="section-band">
	<div class="wrap">
		<span class="kicker">Redirecionamento</span>
		<h2>Seu endereço no Japão sou eu! 🏠</h2>
		<p class="lead">
			Tem loja no Japão que não entrega fora do país? Você compra sozinha no site da loja, manda
			entregar no meu endereço aqui no Japão, e eu recebo, confiro com foto e reenvio pra sua casa
			com rastreio. É o jeito de comprar em qualquer loja japonesa, mesmo nas que não enviam pro
			exterior.
		</p>

		<figure>
			<img
				src="/images/site/donki-corredor.jpg"
				alt="Corredor de cosméticos em uma Don Quijote no Japão, com prateleiras cheias de produtos"
				loading="lazy"
			/>
			<figcaption>
				Foto ilustrativa: um corredor de cosméticos da Don Quijote, no Japão — suas compras chegam
				até mim e daqui vão pra sua casa.
			</figcaption>
		</figure>

		<Steps {steps} />

		<h3 class="shops-title">Lojas japonesas pra você comprar e mandar entregar aqui</h3>
		<div class="shops">
			{#each shops as shop (shop.name)}
				<a class="shop" href={shop.url} target="_blank" rel="noopener">
					<span class="shop-name">{shop.name}<ExternalLink /></span>
					<span class="shop-note">{shop.note}</span>
					<span class="shop-go">Visitar a loja</span>
				</a>
			{/each}
		</div>

		<p class="note">
			Você paga os produtos direto pra loja. Pra mim, você paga só a minha taxa de serviço e o frete
			internacional do reenvio — tudo combinado antes, no direct. A loja que você quer não está na
			lista? Se ela entregar dentro do Japão, dá pra redirecionar: me pergunta no direct. 💗
		</p>
	</div>
</section>

<style>
	figure {
		margin: 26px 0 0;
	}

	figure img {
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		width: 100%;
		aspect-ratio: 16 / 10;
		object-fit: cover;
		object-position: center 30%;
	}

	figcaption {
		font-size: 13.5px;
		color: var(--muted);
		margin-top: 9px;
		text-align: center;
	}

	.shops-title {
		margin-top: 40px;
		font-size: 21px;
	}

	.shops {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		margin-top: 16px;
	}

	@media (min-width: 700px) {
		.shops {
			grid-template-columns: repeat(3, 1fr);
			gap: 14px;
		}
	}

	@media (min-width: 1024px) {
		.shops {
			grid-template-columns: repeat(4, 1fr);
			gap: 16px;
		}
	}

	.shop {
		display: flex;
		flex-direction: column;
		gap: 6px;
		text-decoration: none;
		background: #ffffff;
		border: 1.5px solid #f6d3e0;
		border-radius: 16px;
		padding: 18px 16px;
		color: var(--ink);
		box-shadow: 0 8px 22px rgba(200, 95, 134, 0.07);
	}

	.shop:hover {
		border-color: var(--pink);
	}

	.shop-name {
		font-size: 19px;
		font-weight: 800;
		color: var(--ink-strong);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}

	.shop-name :global(svg) {
		width: 18px;
		height: 18px;
		stroke: var(--pink);
		flex: none;
	}

	.shop-note {
		font-size: 14px;
		color: var(--muted);
		line-height: 1.45;
	}

	.shop-go {
		margin-top: auto;
		padding-top: 6px;
		font-size: 14px;
		font-weight: 800;
		color: var(--pink-dark);
	}

	.note {
		margin: 22px 0 0;
		font-size: 15.5px;
		color: var(--muted);
		max-width: 68ch;
	}
</style>
