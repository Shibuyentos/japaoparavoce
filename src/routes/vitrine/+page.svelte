<script lang="ts">
	import Info from '@lucide/svelte/icons/info';
	import Search from '@lucide/svelte/icons/search';
	import { goto } from '$app/navigation';
	import CategoryTabs from '#lib/components/CategoryTabs.svelte';
	import InstagramIcon from '#lib/components/InstagramIcon.svelte';
	import ProductGrid from '#lib/components/ProductGrid.svelte';
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
		content="Skincare, cabelo, protetor solar e maquiagem japonesa e coreana, com o preço da etiqueta da loja no Japão. Sob encomenda, com envio rastreado."
	/>
</svelte:head>

<div class="wrap">
	<header class="page-head">
		<h1>Vitrine</h1>
		<p class="lead">
			Skincare japonês e coreano das lojas do Japão, sempre sob encomenda. O preço é o da etiqueta
			da loja, já com imposto.
		</p>
		<p class="legend">
			<Info aria-hidden="true" />
			<span>
				<strong>Preço de referência</strong> é o valor das lojas online do Japão. Nesses produtos, o valor
				exato é confirmado no orçamento, antes do pagamento.
			</span>
		</p>
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
		<ProductGrid products={data.products} eagerCount={4} />
	{:else}
		<div class="empty">
			<h2>Não encontrei esse produto na vitrine</h2>
			<p>
				Confira se o nome está certo ou tente outra palavra. Se mesmo assim não aparecer, me mande a
				foto ou o link no direct: eu procuro nas lojas do Japão.
			</p>
			<a class="btn btn-primary" href={INSTAGRAM_URL} target="_blank" rel="external noopener">
				<InstagramIcon />Procurar pelo direct
			</a>
		</div>
	{/if}
</div>

<style>
	.legend {
		display: flex;
		gap: 10px;
		max-width: 62ch;
		margin-top: 16px;
		font-size: 0.875rem;
		color: var(--ink-soft);
	}

	.legend :global(svg) {
		flex: none;
		width: 18px;
		height: 18px;
		margin-top: 1px;
		color: var(--beni);
	}

	.legend strong {
		font-weight: 600;
		color: var(--ink);
	}

	.toolbar {
		display: grid;
		gap: 12px;
		margin-top: 24px;
	}

	.search {
		position: relative;
	}

	.search :global(svg) {
		position: absolute;
		top: 50%;
		left: 14px;
		width: 19px;
		height: 19px;
		color: var(--ink-soft);
		transform: translateY(-50%);
		pointer-events: none;
	}

	.search input {
		padding-left: 44px;
	}

	.result-count {
		margin: 20px 0 14px;
		font-size: 0.875rem;
		color: var(--ink-soft);
	}

	.empty {
		max-width: 560px;
		padding: 28px 0 8px;
	}

	.empty h2 {
		font-size: 1.5rem;
	}

	.empty p {
		margin: 10px 0 22px;
		color: var(--ink-soft);
	}

	/* Nas telas largas a busca e as categorias ficam numa barra que acompanha a rolagem. */
	@media (min-width: 960px) {
		.toolbar {
			position: sticky;
			top: var(--header-height);
			z-index: 5;
			grid-template-columns: 300px minmax(0, 1fr);
			align-items: center;
			gap: 20px;
			margin-top: 32px;
			padding: 12px 0;
			border-bottom: 1px solid var(--line);
			background: var(--paper);
		}

		.result-count {
			margin: 24px 0 18px;
		}
	}
</style>
