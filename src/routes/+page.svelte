<script lang="ts">
	import CategoryTabs from '#lib/components/CategoryTabs.svelte';
	import InstagramIcon from '#lib/components/InstagramIcon.svelte';
	import KitCard from '#lib/components/KitCard.svelte';
	import ProductShelf from '#lib/components/ProductShelf.svelte';
	import Forwarding from '#lib/components/home/Forwarding.svelte';
	import Hero from '#lib/components/home/Hero.svelte';
	import HowItWorks from '#lib/components/home/HowItWorks.svelte';
	import MoreCategories from '#lib/components/home/MoreCategories.svelte';
	import Notices from '#lib/components/home/Notices.svelte';
	import { resolve } from '$app/paths';
	import { INSTAGRAM_HANDLE, INSTAGRAM_URL, STORE_NAME } from '#lib/config.ts';
	import { vitrineHref } from '#lib/links.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const productCount = $derived(
		data.categories.reduce((sum, category) => sum + category.productCount, 0)
	);
</script>

<svelte:head>
	<title>{STORE_NAME}</title>
	<meta
		name="description"
		content="Do Japão Pra Você: compro produtos novos nas lojas do Japão e envio pra você com rastreio. Skincare japonês e coreano direto das lojas do Japão, sob encomenda."
	/>
</svelte:head>

<Hero />

<section id="vitrine" class="showcase">
	<div class="wrap wrap-wide">
		<div class="heading">
			<h2>Novidades da vitrine</h2>
			<p class="lead">
				Skincare japonês e coreano com o <strong>preço da etiqueta da loja</strong>, já com imposto.
				Não é estoque: cada item é comprado sob encomenda, especialmente pra você.
			</p>
		</div>

		<CategoryTabs categories={data.categories} hrefFor={(slug) => vitrineHref(slug)} />

		<div class="shelf">
			<ProductShelf products={data.highlightedProducts} />
		</div>

		<a class="btn btn-primary" href={resolve('/vitrine')}>Ver os {productCount} produtos</a>
	</div>
</section>

<HowItWorks fees={data.fees} shippingTable={data.shippingTable} />

{#if data.kits.length > 0}
	<section id="kits" class="kits">
		<div class="wrap wrap-wide">
			<h2>Kits de skincare para iniciantes</h2>
			<p class="lead">
				Não sabe por onde começar? Montei {data.kits.length} rotinas prontas, uma para cada tipo de pele.
				É só seguir as etapas na ordem, todo dia.
			</p>
			<div class="kit-list">
				{#each data.kits as kit (kit.slug)}
					<KitCard {kit} />
				{/each}
			</div>
		</div>
	</section>
{/if}

<Forwarding />
<MoreCategories />
<Notices />

<section class="closing">
	<div class="wrap wrap-wide">
		<h2>Quer algo que não está na vitrine?</h2>
		<p class="lead">
			Me chama no Instagram com o link ou a foto do que você quer. Eu monto seu orçamento completo,
			sem compromisso.
		</p>
		<a class="btn btn-primary" href={INSTAGRAM_URL} target="_blank" rel="external noopener">
			<InstagramIcon />Chamar {INSTAGRAM_HANDLE}
		</a>
	</div>
</section>

<style>
	.showcase,
	.kits {
		padding-top: 72px;
	}

	.heading {
		margin-bottom: 12px;
	}

	.shelf {
		margin: 20px 0 32px;
	}

	.showcase .btn {
		width: 100%;
	}

	/* A vitrine da página inicial mostra só fileiras completas: o que sobraria numa fileira
	   pela metade fica escondido conforme o número de colunas. */
	.shelf :global(li:nth-child(n + 9)) {
		display: none;
	}

	.kit-list {
		display: grid;
		gap: 48px;
		margin-top: 28px;
	}

	.closing {
		margin-top: 72px;
		padding: 48px 0;
		background: var(--blush);
	}

	.closing .btn {
		margin-top: 22px;
	}

	/* O rodapé encosta na faixa de fechamento, sem o espaço que separa as outras seções. */
	:global(main:has(.closing) + footer) {
		margin-top: 0;
	}

	@media (min-width: 640px) {
		.showcase .btn {
			width: auto;
		}

		.shelf :global(li:nth-child(9)) {
			display: flex;
		}
	}

	@media (min-width: 900px) {
		.showcase,
		.kits {
			padding-top: 112px;
		}

		.heading {
			margin-bottom: 20px;
		}

		.shelf {
			margin: 28px 0 40px;
		}

		.shelf :global(li:nth-child(9)) {
			display: none;
		}

		.kit-list {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 56px;
			margin-top: 40px;
		}

		.closing {
			margin-top: 112px;
			padding: 80px 0;
		}
	}
	@media (min-width: 1200px) {
		.shelf :global(li:nth-child(n + 9)) {
			display: flex;
		}
	}
</style>
