<script lang="ts">
	import ShoppingBag from '@lucide/svelte/icons/shopping-bag';
	import CategoryChips from '#lib/components/CategoryChips.svelte';
	import KitCard from '#lib/components/KitCard.svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import Steps from '#lib/components/Steps.svelte';
	import Forwarding from '#lib/components/home/Forwarding.svelte';
	import Hero from '#lib/components/home/Hero.svelte';
	import MoreCategories from '#lib/components/home/MoreCategories.svelte';
	import Notices from '#lib/components/home/Notices.svelte';
	import Services from '#lib/components/home/Services.svelte';
	import { resolve } from '$app/paths';
	import { STORE_NAME } from '#lib/config.ts';
	import { vitrineHref } from '#lib/links.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const howItWorks = [
		{
			title: 'Você escolhe o produto',
			text: 'Escolhe na vitrine ou me chama no Instagram com o link ou a foto do que você quer.'
		},
		{
			title: 'Eu passo o orçamento completo',
			text: 'Produto + fretes + minha taxa, tudo somado antes. Sem surpresa depois.'
		},
		{
			title: 'Você paga e eu compro na loja',
			text: 'Com o pagamento feito, eu vou até a loja e compro o seu produto, novinho.'
		},
		{
			title: 'Embalo, posto e mando o rastreio',
			text: 'Embalo com cuidado, posto no correio e te mando o código de rastreio.'
		}
	];
</script>

<svelte:head>
	<title>{STORE_NAME}</title>
	<meta
		name="description"
		content="Do Japão Pra Você — compro produtos novos nas lojas do Japão e envio pra você com rastreio. Skincare japonês e coreano direto das lojas do Japão, sob encomenda."
	/>
</svelte:head>

<Hero />

<section id="como-funciona">
	<div class="wrap">
		<span class="kicker">Passo a passo</span>
		<h2>Como funciona</h2>
		<p class="lead">É simples: você escolhe, eu compro na loja e envio pra você. Em 4 passos:</p>
		<Steps steps={howItWorks} />
	</div>
</section>

<section id="vitrine" class="section-band">
	<div class="wrap wrap-wide">
		<span class="kicker">Destaques da vitrine</span>
		<div class="vitrine-intro">
			<div>
				<h2>Skincare japonês e coreano direto das lojas do Japão 🇯🇵✨</h2>
				<p class="lead">
					Eu fotografo os produtos de verdade nas lojas do Japão e anoto o
					<strong>preço real da etiqueta</strong>. Não é estoque: cada item é
					<strong>sob encomenda</strong>, comprado na loja especialmente pra você.
				</p>
			</div>
			<figure>
				<img
					src="/images/site/donki-kbeauty.jpg"
					alt="Corredor de cosméticos em uma Don Quijote no Japão"
					loading="lazy"
				/>
				<figcaption>Foto ilustrativa: o setor de cosméticos de uma loja no Japão.</figcaption>
			</figure>
		</div>

		<div class="categories">
			<CategoryChips categories={data.categories} hrefFor={(slug) => vitrineHref(slug)} />
		</div>

		<div class="grid-products">
			{#each data.highlightedProducts as product (product.slug)}
				<ProductCard {product} />
			{/each}
		</div>

		<div class="see-all">
			<a class="btn btn-primary" href={resolve('/vitrine')}><ShoppingBag />Ver toda a vitrine</a>
		</div>
	</div>
</section>

{#if data.kits.length > 0}
	<section id="kits" class="section-band">
		<div class="wrap">
			<h2>Kits de Skincare para Iniciantes</h2>
			<p class="lead">
				Não sabe por onde começar? Montei {data.kits.length} rotinas prontinhas, uma para cada tipo de
				pele. É só seguir as etapas na ordem, todo dia.
			</p>
			<div class="kits">
				{#each data.kits as kit (kit.slug)}
					<KitCard {kit} />
				{/each}
			</div>
		</div>
	</section>
{/if}

<Services />
<Forwarding />
<MoreCategories />
<Notices />

<style>
	.vitrine-intro {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px;
		align-items: center;
		margin-top: 8px;
	}

	@media (min-width: 860px) {
		.vitrine-intro {
			grid-template-columns: 1.1fr 0.9fr;
		}
	}

	figure {
		margin: 0;
	}

	figure img {
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
	}

	figcaption {
		font-size: 13.5px;
		color: var(--muted);
		margin-top: 9px;
		text-align: center;
	}

	.categories {
		margin-top: 26px;
	}

	.see-all {
		display: flex;
		justify-content: center;
		margin-top: 28px;
	}

	.kits {
		display: grid;
		grid-template-columns: 1fr;
		gap: 18px;
		margin-top: 30px;
	}

	@media (min-width: 980px) {
		.kits {
			grid-template-columns: repeat(3, 1fr);
			gap: 16px;
			align-items: start;
		}
	}
</style>
