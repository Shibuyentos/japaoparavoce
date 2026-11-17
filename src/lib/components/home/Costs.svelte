<script lang="ts">
	import { resolve } from '$app/paths';
	import Receipt from '#lib/components/Receipt.svelte';
	import { formatJpy, formatWeight } from '#lib/format.ts';
	import type { ShippingRegionRates, StoreFees } from '#lib/types.ts';

	type Props = {
		fees: StoreFees;
		// A primeira região da tabela é a que mais recebe pedidos: o Brasil.
		mainRegion: ShippingRegionRates;
	};

	let { fees, mainRegion }: Props = $props();

	const lightestRate = $derived(mainRegion.rates[0]);
</script>

<section class="costs" aria-labelledby="custos-titulo">
	<div class="wrap layout">
		<div class="text">
			<h2 id="custos-titulo">Quanto custa de verdade</h2>
			<p class="lead">
				O produto sai pelo preço da etiqueta. Em cada pedido somam-se só mais três valores, e o
				carrinho mostra todos antes de você enviar.
			</p>
			<ul>
				<li>
					<strong>Fretes e taxa são por pedido.</strong> Juntar mais produtos na mesma caixa sai mais
					em conta.
				</li>
				<li>
					<strong>Se o frete mudar depois de pesar a caixa,</strong> eu aviso antes de postar e só sigo
					com a sua aprovação.
				</li>
				<li>
					<strong>Imposto de alfândega não está incluído.</strong> Se o seu país cobrar, ele é pago na
					chegada.
				</li>
			</ul>
			<a class="text-link" href={resolve('/como-funciona#valores')}>Ver a tabela de fretes</a>
		</div>

		<div class="receipt">
			<Receipt>
				<dl>
					<div>
						<dt><span>Produtos</span></dt>
						<dd class="soft">preço da etiqueta</dd>
					</div>
					<div>
						<dt><span>Frete interno no Japão</span></dt>
						<dd class="price">{formatJpy(fees.domesticShippingJpy)}</dd>
					</div>
					<div>
						<dt><span>Taxa de serviço</span></dt>
						<dd class="price">{formatJpy(fees.serviceFeeJpy)}</dd>
					</div>
					<div>
						<dt>
							<span>
								Frete internacional (EMS)
								<span class="detail">
									{mainRegion.name}, caixa de até {formatWeight(lightestRate.maxWeightGrams)}
								</span>
							</span>
						</dt>
						<dd><span class="soft">a partir de</span> {formatJpy(lightestRate.priceJpy)}</dd>
					</div>
				</dl>
				<p class="foot">Você aprova o total antes de pagar.</p>
			</Receipt>
		</div>
	</div>
</section>

<style>
	.costs {
		margin-top: var(--section-gap);
		padding: 48px 0;
		background: var(--blush);
	}

	.layout {
		display: grid;
		gap: 36px;
	}

	ul {
		display: grid;
		gap: 12px;
		max-width: 52ch;
		margin: 22px 0 10px;
		padding: 0;
		list-style: none;
	}

	li {
		padding-left: 18px;
		border-left: 2px solid var(--sakura);
		color: var(--ink-soft);
	}

	li strong {
		font-weight: 600;
		color: var(--ink);
	}

	.receipt {
		max-width: 440px;
	}

	.detail {
		display: block;
		font-size: 0.8125rem;
		color: var(--ink-soft);
	}

	dd.price {
		font-size: 1rem;
	}

	.soft {
		font-weight: 400;
		color: var(--ink-soft);
	}

	.foot {
		margin-top: 12px;
		padding-top: 12px;
		border-top: 2px solid var(--ink);
		font-weight: 650;
	}

	@media (min-width: 900px) {
		.costs {
			padding: 88px 0;
		}

		.layout {
			grid-template-columns: minmax(0, 1fr) minmax(0, 440px);
			gap: 72px;
			align-items: center;
		}
	}
</style>
