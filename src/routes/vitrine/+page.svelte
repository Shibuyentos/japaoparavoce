<script lang="ts">
	import Search from '@lucide/svelte/icons/search';
	import { goto } from '$app/navigation';
	import CategoryChips from '#lib/components/CategoryChips.svelte';
	import InstagramIcon from '#lib/components/InstagramIcon.svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import { INSTAGRAM_URL, STORE_NAME } from '#lib/config.ts';
	import { vitrineHref } from '#lib/links.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Acompanha a URL (voltar/avançar, links), mas pode ser editado enquanto a pessoa digita.
	let search = $derived(data.search);

	// Cada letra dispara uma navegação; o SvelteKit descarta as que ficaram para trás,
	// então o resultado exibido sempre corresponde ao que está no campo.
	function updateSearch() {
		goto(vitrineHref(data.activeCategory, search), { replace: true, reset: false });
	}

	const isFiltered = $derived(data.activeCategory !== null || data.search.trim() !== '');

	const resultLabel = $derived.by(() => {
		const total = data.products.length;
		if (!isFiltered) return `${total} produtos`;
		return total === 1 ? '1 produto encontrado' : `${total} produtos encontrados`;
	});
</script>

<svelte:head>
	<title>Vitrine · {STORE_NAME}</title>
	<meta
		name="description"
		content="Skincare, cabelo, protetor solar e maquiagem japonesa e coreana, com preço real da loja no Japão. Sob encomenda, com envio rastreado."
	/>
</svelte:head>

<section class="section-band">
	<div class="wrap wrap-wide">
		<span class="kicker">Vitrine</span>
		<h1>Skincare japonês e coreano direto das lojas do Japão 🇯🇵✨</h1>
		<p class="lead">
			Os preços são os da <strong>etiqueta da loja</strong>, já com imposto. Nada é estoque: cada
			item é <strong>sob encomenda</strong>, comprado na loja especialmente pra você. Alguns itens
			têm <strong>preço de referência</strong> das lojas online do Japão — o valor exato é confirmado
			no orçamento, antes do pagamento.
		</p>

		<div class="toolbar">
			<CategoryChips
				categories={data.categories}
				active={data.activeCategory}
				hrefFor={(slug) => vitrineHref(slug, search)}
				keepScroll
			/>

			<form
				class="search"
				method="GET"
				action="/vitrine"
				role="search"
				onsubmit={(event) => {
					event.preventDefault();
					updateSearch();
				}}
			>
				{#if data.activeCategory}
					<input type="hidden" name="categoria" value={data.activeCategory} />
				{/if}
				<label class="visually-hidden" for="busca">Buscar produto ou marca</label>
				<Search />
				<input
					id="busca"
					name="busca"
					type="search"
					bind:value={search}
					oninput={updateSearch}
					placeholder="Buscar produto ou marca… (ex.: protetor, FINO, LuLuLun)"
					autocomplete="off"
					maxlength="80"
				/>
			</form>
			<p class="result-count" role="status">{resultLabel}</p>
		</div>

		{#if data.products.length > 0}
			<div class="grid-products">
				{#each data.products as product, index (product.slug)}
					<ProductCard {product} eager={index < 4} />
				{/each}
			</div>
		{:else}
			<div class="empty">
				<p>
					Não achou o que procura? 😊 Manda a foto do produto no nosso direct que a gente procura
					pra você nas lojas do Japão 🇯🇵
				</p>
				<a class="btn btn-primary" href={INSTAGRAM_URL} target="_blank" rel="external noopener">
					<InstagramIcon />
					Chamar no direct
				</a>
			</div>
		{/if}
	</div>
</section>

<style>
	h1 {
		font-size: clamp(26px, 5.4vw, 36px);
		font-weight: 800;
		letter-spacing: -0.01em;
		color: var(--pink-title);
	}

	.toolbar {
		position: sticky;
		top: 0;
		z-index: 2;
		background: #ffffff;
		margin-top: 26px;
		padding: 14px 0 12px;
		border-bottom: 1px solid #f6d3e0;
		box-shadow: 0 16px 18px -18px rgba(200, 95, 134, 0.45);
	}

	.search {
		position: relative;
		max-width: 640px;
		margin-top: 2px;
	}

	.search :global(svg) {
		position: absolute;
		left: 17px;
		top: 50%;
		transform: translateY(-50%);
		width: 21px;
		height: 21px;
		stroke: var(--pink-dark);
		pointer-events: none;
	}

	.search input {
		width: 100%;
		font-family: inherit;
		font-size: 17px;
		font-weight: 500;
		color: var(--ink);
		background: #ffffff;
		border: 2px solid var(--pink-input);
		border-radius: 999px;
		padding: 14px 20px 14px 48px;
		box-shadow: 0 8px 22px rgba(200, 95, 134, 0.08);
	}

	.search input::placeholder {
		color: #b07f93;
	}

	.search input:focus {
		outline: none;
		border-color: var(--pink);
		box-shadow: 0 0 0 4px rgba(236, 127, 168, 0.16);
	}

	.result-count {
		margin: 10px 0 0;
		font-size: 14.5px;
		font-weight: 600;
		color: var(--muted);
	}

	.empty {
		margin-top: 30px;
		text-align: center;
		background: #fff5f9;
		border: 1.5px dashed #f5a3c6;
		border-radius: 20px;
		padding: 32px 22px;
	}

	.empty p {
		margin: 0 auto 16px;
		max-width: 520px;
		font-size: 17px;
		line-height: 1.55;
	}
</style>
