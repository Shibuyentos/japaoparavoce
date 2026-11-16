<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import House from '@lucide/svelte/icons/house';
	import ShoppingBag from '@lucide/svelte/icons/shopping-bag';
	import { resolve } from '$app/paths';
	import InstagramIcon from '#lib/components/InstagramIcon.svelte';
	import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '#lib/config.ts';

	const highlights = ['Só produtos novos', 'Compra sob encomenda', 'Envio com rastreio'];
</script>

<header class="hero">
	<div class="wrap grid">
		<div>
			<div class="brand">
				<img
					src="/images/site/logo.webp"
					alt="Logo da Do Japão Pra Você: sacola de compras rosa com flor de sakura na frente de um portão torii vermelho"
					width="84"
					height="84"
				/>
				<div>
					<div class="brand-name">Loja de encomendas do Japão</div>
					<a class="brand-handle" href={INSTAGRAM_URL} target="_blank" rel="external noopener">
						{INSTAGRAM_HANDLE}
					</a>
				</div>
			</div>

			<h1>Do Japão <span class="accent">Pra Você</span></h1>
			<p class="tagline">Produtos do Japão, comprados pra você e enviados com rastreio 🇯🇵✈️</p>
			<p class="sub">
				Eu moro no Japão, compro o produto <strong>novo</strong> na loja pra você e envio pro Brasil e
				pro mundo. Sem estoque, sem surpresa: você vê o preço da loja antes de fechar.
			</p>

			<ul class="highlights">
				{#each highlights as highlight (highlight)}
					<li><Check />{highlight}</li>
				{/each}
			</ul>

			<div class="actions">
				<a class="btn btn-primary" href={resolve('/vitrine')}><ShoppingBag />Ver a vitrine</a>
				<a class="btn btn-primary" href={INSTAGRAM_URL} target="_blank" rel="external noopener">
					<InstagramIcon />Pedir orçamento
				</a>
				<a class="btn btn-ghost" href="#redirecionamento"><House />Seu endereço no Japão</a>
			</div>
		</div>

		<figure class="photo">
			<img
				src="/images/site/hero-donki.jpg"
				alt="Interior de uma loja Don Quijote no Japão, com prateleiras cheias de produtos japoneses"
			/>
			<figcaption>
				Foto ilustrativa: o interior de uma Don Quijote no Japão — uma das lojas onde eu compro pra
				você.
			</figcaption>
		</figure>
	</div>
</header>

<style>
	.hero {
		padding: 34px 0 10px;
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 28px;
		align-items: center;
	}

	@media (min-width: 860px) {
		.grid {
			grid-template-columns: 1.05fr 0.95fr;
			gap: 44px;
		}
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.brand img {
		width: 84px;
		height: 84px;
		border-radius: 24px;
		box-shadow: var(--shadow);
		object-fit: cover;
	}

	.brand-name {
		font-size: 15px;
		font-weight: 700;
		color: var(--muted);
	}

	.brand-handle {
		font-size: 15px;
		font-weight: 700;
		text-decoration: none;
	}

	h1 {
		font-size: clamp(34px, 8.4vw, 56px);
		font-weight: 800;
		letter-spacing: -0.015em;
		margin-top: 22px;
	}

	.accent {
		color: var(--japan-red);
	}

	.tagline {
		font-size: clamp(19px, 4.6vw, 23px);
		font-weight: 700;
		margin: 14px 0 0;
	}

	.sub {
		color: var(--muted);
		margin: 10px 0 0;
		max-width: 52ch;
	}

	.highlights {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin: 20px 0 0;
		padding: 0;
		list-style: none;
	}

	.highlights li {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: 999px;
		padding: 6px 13px;
		font-size: 14.5px;
		font-weight: 700;
	}

	.highlights :global(svg) {
		width: 16px;
		height: 16px;
		stroke: var(--gold);
		stroke-width: 2.4;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 26px;
	}

	@media (max-width: 759px) {
		.actions {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 10px;
		}

		.actions .btn {
			padding: 13px 10px;
			font-size: 15.5px;
		}

		.actions .btn:first-child {
			grid-column: 1 / -1;
		}
	}

	.photo {
		margin: 0;
	}

	.photo img {
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		aspect-ratio: 4 / 3;
		object-fit: cover;
		width: 100%;
	}

	figcaption {
		font-size: 14px;
		color: var(--muted);
		margin-top: 10px;
		text-align: center;
	}
</style>
