<script lang="ts">
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import Steps from '#lib/components/Steps.svelte';

	const steps = [
		{
			title: 'Peça meu endereço no direct',
			text: 'Antes de comprar, me chama no Instagram: eu te passo o meu endereço no Japão na conversa. Ele não fica publicado aqui, é só pra clientes.'
		},
		{
			title: 'Compre na loja que você quiser',
			text: 'Faça a sua compra normalmente no site da loja japonesa e coloque o meu endereço como endereço de entrega.'
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

<section id="redirecionamento">
	<div class="wrap wrap-wide">
		<h2>Seu endereço no Japão sou eu</h2>
		<p class="lead">
			Tem loja no Japão que não entrega fora do país? Você compra sozinha no site da loja, manda
			entregar no meu endereço aqui no Japão, e eu recebo, confiro com foto e reenvio pra sua casa
			com rastreio.
		</p>

		<div class="steps">
			<Steps {steps} />
		</div>

		<div class="shops">
			<div>
				<h3>Lojas pra comprar e mandar entregar aqui</h3>
				<p class="note">
					Você paga os produtos direto pra loja. Pra mim, você paga só a minha taxa de serviço e o
					frete internacional do reenvio, tudo combinado antes, no direct. A loja que você quer não
					está na lista? Se ela entregar dentro do Japão, dá pra redirecionar: me pergunta no
					direct.
				</p>
			</div>
			<ul>
				{#each shops as shop (shop.name)}
					<li>
						<a href={shop.url} target="_blank" rel="noopener">
							<span>
								<strong>{shop.name}</strong>
								<span class="shop-note">{shop.note}</span>
							</span>
							<ExternalLink aria-hidden="true" />
							<span class="visually-hidden">(abre em outra aba)</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<style>
	section {
		padding-top: 72px;
	}

	.steps {
		margin-top: 24px;
	}

	.shops {
		display: grid;
		gap: 16px;
		margin-top: 48px;
	}

	.shops h3 {
		font-family: var(--font-display);
		font-size: 1.375rem;
	}

	.note {
		max-width: 68ch;
		margin-top: 10px;
		font-size: 0.9375rem;
		color: var(--ink-soft);
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		border-top: 1px solid var(--line);
	}

	li:last-child {
		border-bottom: 1px solid var(--line);
	}

	li a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 12px 0;
		color: var(--ink);
		text-decoration: none;
	}

	li a:hover strong {
		text-decoration: underline;
	}

	strong {
		display: block;
	}

	.shop-note {
		font-size: 0.875rem;
		color: var(--ink-soft);
	}

	li a :global(svg) {
		flex: none;
		width: 18px;
		height: 18px;
		color: var(--beni);
	}

	@media (min-width: 900px) {
		section {
			padding-top: 112px;
		}

		.steps {
			margin-top: 40px;
		}

		.shops {
			margin-top: 64px;
		}

		ul {
			display: grid;
			grid-template-columns: 1fr 1fr;
			column-gap: 72px;
		}

		/* Com duas colunas, a última linha de cada coluna fecha a lista. */
		li:nth-last-child(2):nth-child(odd) {
			border-bottom: 1px solid var(--line);
		}
	}
</style>
