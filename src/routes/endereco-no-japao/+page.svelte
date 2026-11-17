<script lang="ts">
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import InstagramIcon from '#lib/components/InstagramIcon.svelte';
	import Steps from '#lib/components/Steps.svelte';
	import { INSTAGRAM_URL, STORE_NAME } from '#lib/config.ts';

	const steps = [
		{
			title: 'Peça meu endereço no direct',
			text: 'Antes de comprar, me chama no Instagram: eu te passo o meu endereço no Japão na conversa. Ele não fica publicado aqui, é só para clientes.'
		},
		{
			title: 'Compre na loja que você quiser',
			text: 'Faça a compra normalmente no site da loja japonesa e coloque o meu endereço como endereço de entrega.'
		},
		{
			title: 'Eu recebo e confiro com foto',
			text: 'Quando a sua compra chegar aqui, eu confiro tudo e te mando foto do que chegou, antes de reenviar.'
		},
		{
			title: 'Reenvio pra sua casa, com rastreio',
			text: 'Junto as suas compras numa caixa só, embalo com cuidado, posto no correio e te mando o código de rastreio.'
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

<svelte:head>
	<title>Endereço no Japão · {STORE_NAME}</title>
	<meta
		name="description"
		content="Compre em lojas japonesas que não entregam fora do Japão: mande entregar no meu endereço, eu confiro com foto e reenvio pra você com rastreio."
	/>
</svelte:head>

<div class="wrap">
	<header class="page-head">
		<h1>Seu endereço no Japão</h1>
		<p class="lead">
			Tem loja no Japão que não entrega fora do país? Você compra no site da loja, manda entregar no
			meu endereço aqui, e eu recebo, confiro com foto e reenvio pra sua casa com rastreio.
		</p>
	</header>

	<section class="block" aria-label="Passo a passo">
		<Steps {steps} />
	</section>

	<section class="block shops" aria-labelledby="lojas-titulo">
		<div>
			<h2 id="lojas-titulo">Lojas para comprar e mandar entregar aqui</h2>
			<p class="note">
				Você paga os produtos direto para a loja. Para mim, só a taxa de serviço e o frete
				internacional do reenvio, tudo combinado antes, no direct. A loja que você quer não está na
				lista? Se ela entrega dentro do Japão, dá para redirecionar.
			</p>
			<a class="btn btn-primary" href={INSTAGRAM_URL} target="_blank" rel="external noopener">
				<InstagramIcon />Pedir o endereço no direct
			</a>
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
	</section>
</div>

<style>
	.block {
		margin-top: 40px;
	}

	.shops {
		display: grid;
		gap: 28px;
		margin-top: var(--section-gap);
	}

	.note {
		max-width: 56ch;
		margin: 12px 0 20px;
		color: var(--ink-soft);
	}

	ul {
		margin: 0;
		padding: 0;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--surface);
		list-style: none;
	}

	li + li {
		border-top: 1px solid var(--line);
	}

	li a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 14px 18px;
		color: var(--ink);
		text-decoration: none;
	}

	li a:hover strong {
		text-decoration: underline;
	}

	strong {
		display: block;
		font-weight: 650;
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
		.block {
			margin-top: 56px;
		}

		.shops {
			grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
			gap: 64px;
			align-items: start;
			margin-top: var(--section-gap);
		}
	}
</style>
