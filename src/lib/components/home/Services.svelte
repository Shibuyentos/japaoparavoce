<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import House from '@lucide/svelte/icons/house';
	import ShoppingBag from '@lucide/svelte/icons/shopping-bag';
</script>

<section id="servicos">
	<div class="wrap">
		<span class="kicker">Dois jeitos de comprar</span>
		<h2>Meus 2 serviços</h2>

		<div class="services">
			<article>
				<div class="icon"><ShoppingBag /></div>
				<h3>Comprador pessoal</h3>
				<p>
					Eu compro pra você em qualquer loja do Japão. Você só me diz o que quer — o resto é
					comigo.
				</p>
				<ul>
					<li><Check />Você escolhe na vitrine ou manda o link ou a foto do produto</li>
					<li><Check />Eu confirmo preço e disponibilidade na loja</li>
					<li><Check />Compro, embalo e posto com rastreio</li>
				</ul>
			</article>

			<article>
				<div class="icon"><House /></div>
				<h3>Endereço no Japão</h3>
				<p>
					Você compra sozinho numa loja japonesa, manda entregar no meu endereço — e eu reenvio pra
					você.
				</p>
				<ul>
					<li><Check />Ideal pra lojas que não enviam pro exterior</li>
					<li><Check />Recebo sua caixa aqui no Japão</li>
					<li><Check />Reenvio pra você com rastreio</li>
				</ul>
				<a class="more" href="#redirecionamento">Ver as lojas e o passo a passo ↓</a>
			</article>
		</div>
	</div>
</section>

<style>
	.services {
		display: grid;
		grid-template-columns: 1fr;
		gap: 18px;
		margin-top: 30px;
	}

	@media (min-width: 760px) {
		.services {
			grid-template-columns: 1fr 1fr;
		}
	}

	article {
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		padding: 26px 24px;
	}

	.icon {
		width: 52px;
		height: 52px;
		border-radius: 16px;
		background: var(--pink-bg);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 14px;
	}

	.icon :global(svg) {
		width: 27px;
		height: 27px;
		stroke: var(--pink);
	}

	p {
		color: var(--muted);
		margin: 8px 0 0;
		font-size: 16px;
	}

	ul {
		margin: 12px 0 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 7px;
		font-size: 15.5px;
	}

	li {
		display: flex;
		gap: 9px;
	}

	li :global(svg) {
		width: 18px;
		height: 18px;
		stroke: var(--gold);
		stroke-width: 2.4;
		flex: none;
		margin-top: 3px;
	}

	.more {
		display: inline-block;
		margin-top: 14px;
		font-weight: 800;
	}
</style>
