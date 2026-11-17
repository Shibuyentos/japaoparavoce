<script lang="ts">
	import CategoryTabs from '#lib/components/CategoryTabs.svelte';
	import KitCard from '#lib/components/KitCard.svelte';
	import ProductGrid from '#lib/components/ProductGrid.svelte';
	import About from '#lib/components/home/About.svelte';
	import Costs from '#lib/components/home/Costs.svelte';
	import Hero from '#lib/components/home/Hero.svelte';
	import HowItWorks from '#lib/components/home/HowItWorks.svelte';
	import MoreServices from '#lib/components/home/MoreServices.svelte';
	import { resolve } from '$app/paths';
	import { STORE_NAME } from '#lib/config.ts';
	import { vitrineHref } from '#lib/links.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const productCount = $derived(
		data.categories.reduce((sum, category) => sum + category.productCount, 0)
	);
</script>

<svelte:head>
	<title>{STORE_NAME}: skincare do Japão sob encomenda</title>
	<meta
		name="description"
		content="Compro skincare japonês e coreano nas lojas do Japão, pelo preço da etiqueta, e envio pra você com rastreio. Você vê o total com frete antes de pagar."
	/>
</svelte:head>

<Hero {productCount} />

<section class="showcase" aria-labelledby="vitrine-titulo">
	<div class="wrap">
		<div class="heading">
			<h2 id="vitrine-titulo">Novidades da vitrine</h2>
			<a class="text-link" href={resolve('/vitrine')}>Ver tudo na vitrine</a>
		</div>

		<CategoryTabs categories={data.categories} hrefFor={(slug) => vitrineHref(slug)} />

		<div class="grid">
			<ProductGrid products={data.highlightedProducts} eagerCount={2} />
		</div>
	</div>
</section>

<Costs fees={data.fees} mainRegion={data.mainRegion} />

<HowItWorks />

{#if data.kits.length > 0}
	<section id="kits" class="kits" aria-labelledby="kits-titulo">
		<div class="wrap">
			<h2 id="kits-titulo">Rotinas prontas para começar</h2>
			<p class="lead">
				Montei {data.kits.length} kits de skincare, um para cada tipo de pele. É só seguir os passos na
				ordem, todo dia.
			</p>
			<ul class="kit-list">
				{#each data.kits as kit (kit.slug)}
					<li><KitCard {kit} /></li>
				{/each}
			</ul>
		</div>
	</section>
{/if}

<About />

<MoreServices />

<style>
	.showcase {
		margin-top: 48px;
	}

	.heading {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 4px 16px;
		margin-bottom: 16px;
	}

	.grid {
		margin-top: 22px;
	}

	/* A vitrine da página inicial mostra só fileiras completas: com duas e três colunas, seis
	   produtos; com quatro, oito. */
	.grid :global(li:nth-child(n + 7)) {
		display: none;
	}

	.kits {
		margin-top: var(--section-gap);
	}

	/* No celular os kits passam de lado; a ponta do próximo à direita mostra que há mais. */
	.kit-list {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: min(86%, 360px);
		gap: 12px;
		margin: 24px calc(var(--gutter) * -1) 0;
		padding: 0 var(--gutter) 8px;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scroll-padding-inline: var(--gutter);
		list-style: none;
	}

	.kit-list li {
		scroll-snap-align: start;
	}

	@media (min-width: 960px) {
		.showcase {
			margin-top: 80px;
		}

		.grid :global(li:nth-child(n + 7)) {
			display: flex;
		}

		.kit-list {
			grid-auto-flow: row;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 24px;
			margin: 40px 0 0;
			padding: 0;
			overflow: visible;
		}
	}
</style>
