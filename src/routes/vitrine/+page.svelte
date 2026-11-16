<script lang="ts">
	import Search from '@lucide/svelte/icons/search';
	import { goto } from '$app/navigation';
	import CategoryTabs from '#lib/components/CategoryTabs.svelte';
	import InstagramIcon from '#lib/components/InstagramIcon.svelte';
	import ProductShelf from '#lib/components/ProductShelf.svelte';
	import { INSTAGRAM_URL, STORE_NAME } from '#lib/config.ts';
	import { countLabel } from '#lib/format.ts';
	import { vitrineHref } from '#lib/links.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Acompanha a URL (voltar/avançar, links), mas pode ser editado enquanto a pessoa digita.
	let search = $derived(data.search);

	// Cada letra dispara uma navegação; o SvelteKit descarta as que ficaram para trás,
	// então o resultado exibido sempre corresponde ao que está no campo.
	function updateSearch() {
		goto(vitrineHref(data.activeCategory, search), {
			replace: true,
			reset: false
		});
	}

	const isFiltered = $derived(data.activeCategory !== null || data.search.trim() !== '');

	const resultLabel = $derived(
		isFiltered
			? countLabel(data.products.length, 'produto encontrado', 'produtos encontrados')
			: countLabel(data.products.length, 'produto', 'produtos')
	);
</script>

<svelte:head>
	<title>Vitrine · {STORE_NAME}</title>
	<meta
		name="description"
		content="Skincare, cabelo, protetor solar e maquiagem japonesa e coreana, com preço real da loja no Japão. Sob encomenda, com envio rastreado."
	/>
</svelte:head>

<div class="wrap wrap-wide">
	<header class="intro">
		<h1>Vitrine</h1>
		<p class="lead">
			Skincare japonês e coreano direto das lojas do Japão. Nada é estoque: cada item é
			<strong>sob encomenda</strong>, comprado na loja especialmente pra você.
		</p>

		<!-- A legenda explica uma vez o que cada etiqueta quer dizer, em vez de repetir em cada produto. -->
		<dl class="legend">
			<div>
				<span class="sample store" aria-hidden="true">¥</span>
				<dt>Etiqueta cheia:</dt>
				<dd>preço da etiqueta da loja, já com imposto.</dd>
			</div>
			<div>
				<span class="sample reference" aria-hidden="true">¥</span>
				<dt>Etiqueta tracejada:</dt>
				<dd>
					preço de referência das lojas online do Japão. O valor exato é confirmado no orçamento,
					antes do pagamento.
				</dd>
			</div>
		</dl>
	</header>

	<div class="toolbar">
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
			<Search aria-hidden="true" />
			<input
				id="busca"
				name="busca"
				type="search"
				bind:value={search}
				oninput={updateSearch}
				placeholder="Buscar produto ou marca"
				autocomplete="off"
				maxlength="80"
			/>
		</form>

		<CategoryTabs
			categories={data.categories}
			active={data.activeCategory}
			hrefFor={(slug) => vitrineHref(slug, search)}
			keepScroll
		/>
	</div>

	<p class="result-count" role="status">{resultLabel}</p>

	{#if data.products.length > 0}
		<h2 class="visually-hidden">Produtos</h2>
		<ProductShelf products={data.products} eagerCount={4} />
	{:else}
		<div class="empty">
			<h2>Não achei esse produto na vitrine</h2>
			<p>
				Manda a foto ou o link no direct que eu procuro pra você nas lojas do Japão. Ou confira se o
				nome está certo e tente outra palavra.
			</p>
			<a class="btn btn-primary" href={INSTAGRAM_URL} target="_blank" rel="external noopener">
				<InstagramIcon />Chamar no direct
			</a>
		</div>
	{/if}
</div>

<style>
	.intro {
		padding: 28px 0 20px;
	}

	.legend {
		display: grid;
		gap: 8px;
		max-width: 720px;
		margin: 18px 0 0;
		font-size: 0.875rem;
	}

	/* Amostra da etiqueta à esquerda; nome e explicação seguem na mesma frase. */
	.legend div {
		position: relative;
		padding-left: 36px;
		color: var(--ink-soft);
	}

	.legend dt {
		display: inline;
		font-weight: 700;
		color: var(--ink);
	}

	.legend dd {
		display: inline;
		margin: 0;
	}

	.sample {
		position: absolute;
		top: 1px;
		left: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 26px;
		height: 22px;
		border: 1.5px solid var(--ink);
		background: var(--white);
		font-family: var(--font-display);
		font-size: 0.8125rem;
		line-height: 1;
	}

	.sample.reference {
		border-style: dashed;
	}

	/* A barra acompanha a rolagem logo abaixo do cabeçalho, de uma borda à outra da tela. */
	.toolbar {
		position: sticky;
		top: var(--header-height);
		z-index: 5;
		margin: 0 calc(var(--gutter) * -1);
		padding: 10px var(--gutter) 0;
		border-bottom: 1px solid var(--line);
		background: var(--paper);
	}

	.search {
		position: relative;
	}

	.search :global(svg) {
		position: absolute;
		top: 50%;
		left: 12px;
		width: 19px;
		height: 19px;
		color: var(--ink-soft);
		transform: translateY(-50%);
		pointer-events: none;
	}

	.search input {
		min-height: 44px;
		padding-left: 40px;
	}

	.result-count {
		margin: 14px 0 6px;
		font-size: 0.875rem;
		color: var(--ink-soft);
	}

	.empty {
		max-width: 560px;
		padding: 32px 0 16px;
	}

	.empty h2 {
		font-size: 1.5rem;
	}

	.empty p {
		margin: 10px 0 20px;
		color: var(--ink-soft);
	}

	@media (min-width: 640px) {
		.intro {
			padding: 44px 0 28px;
		}

		.toolbar {
			display: flex;
			flex-direction: row-reverse;
			align-items: center;
			justify-content: space-between;
			gap: 24px;
			margin: 0;
			padding: 10px 0;
		}

		.search {
			flex: 0 1 320px;
		}

		.result-count {
			margin: 18px 0 10px;
		}
	}
</style>
