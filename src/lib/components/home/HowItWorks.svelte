<script lang="ts">
	import { resolve } from '$app/paths';
	import Steps from '#lib/components/Steps.svelte';
	import { formatJpy, formatWeight } from '#lib/format.ts';
	import type { ShippingRegionRates, StoreFees } from '#lib/types.ts';

	type Props = {
		fees: StoreFees;
		shippingTable: ShippingRegionRates[];
	};

	let { fees, shippingTable }: Props = $props();

	const steps = [
		{
			title: 'Você escolhe o produto',
			text: 'Escolhe na vitrine ou me chama no Instagram com o link ou a foto do que você quer.'
		},
		{
			title: 'Eu passo o orçamento completo',
			text: 'Produto, fretes e minha taxa, tudo somado antes. Sem surpresa depois.'
		},
		{
			title: 'Você paga e eu compro na loja',
			text: 'Com o pagamento feito, eu vou até a loja e compro o seu produto, novo.'
		},
		{
			title: 'Embalo, posto e mando o rastreio',
			text: 'Embalo com cuidado, posto no correio e te mando o código de rastreio.'
		}
	];

	// A tabela EMS termina numa faixa máxima; acima dela o frete é combinado caso a caso.
	const heaviestBandGrams = $derived(
		Math.max(...shippingTable.flatMap((region) => region.rates.map((rate) => rate.maxWeightGrams)))
	);
</script>

<section id="como-funciona">
	<div class="wrap wrap-wide">
		<div class="intro">
			<div>
				<h2>Como funciona</h2>
				<p class="lead">Você escolhe, eu compro na loja e envio pra você. São quatro passos.</p>
			</div>
			<figure>
				<img
					src="/images/site/loja-1200.webp"
					srcset="/images/site/loja-640.webp 640w, /images/site/loja-1200.webp 1200w"
					sizes="(min-width: 900px) 520px, 100vw"
					width="1200"
					height="900"
					alt="Entrada de uma loja Don Quijote no Japão, com prateleiras cheias de produtos"
					loading="lazy"
				/>
				<figcaption>
					Foto ilustrativa: uma Don Quijote no Japão, uma das lojas onde eu compro pra você.
				</figcaption>
			</figure>
		</div>

		<Steps {steps} />

		<div class="cost" id="valores">
			<div>
				<h3>O que entra no valor do pedido</h3>
				<dl class="parts">
					<div>
						<dt>Produtos</dt>
						<dd>preço da etiqueta</dd>
					</div>
					<div>
						<dt>Frete interno no Japão</dt>
						<dd><strong>{formatJpy(fees.domesticShippingJpy)}</strong> por pedido</dd>
					</div>
					<div>
						<dt>Taxa de serviço</dt>
						<dd><strong>{formatJpy(fees.serviceFeeJpy)}</strong> por pedido</dd>
					</div>
					<div>
						<dt>Frete internacional (EMS)</dt>
						<dd>pela tabela</dd>
					</div>
				</dl>
				<p class="note">
					Os produtos entram pelo preço da etiqueta da loja, já com imposto, e esse valor
					<strong>não inclui o frete internacional</strong>. O valor exato do frete só sai com a
					caixa fechada e pesada, porque depende do peso final, das medidas da embalagem e do país
					de destino. Imposto de alfândega não está incluído.
				</p>
				<a class="btn btn-quiet" href={resolve('/carrinho')}>Simular o frete do meu pedido</a>
			</div>

			<div>
				<h3>Tabela do frete internacional (EMS)</h3>
				<!-- O atributo name faz o navegador manter só uma região aberta por vez. -->
				{#each shippingTable as region, index (region.code)}
					<details name="frete" open={index === 0}>
						<summary>{region.name}</summary>
						<table>
							<thead class="visually-hidden">
								<tr>
									<th scope="col">Peso da caixa</th>
									<th scope="col">Frete</th>
								</tr>
							</thead>
							<tbody>
								{#each region.rates as rate (rate.maxWeightGrams)}
									<tr>
										<th scope="row">até {formatWeight(rate.maxWeightGrams)}</th>
										<td>{formatJpy(rate.priceJpy)}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</details>
				{/each}
				<p class="note">
					Acima de {formatWeight(heaviestBandGrams)} o frete é combinado caso a caso.
				</p>
			</div>
		</div>
	</div>
</section>

<style>
	section {
		padding-top: 72px;
	}

	.intro {
		display: grid;
		gap: 20px;
		margin-bottom: 24px;
	}

	figure {
		margin: 0 calc(var(--gutter) * -1);
	}

	figure img {
		width: 100%;
		height: auto;
		aspect-ratio: 16 / 9;
		object-fit: cover;
	}

	figcaption {
		padding: 8px var(--gutter) 0;
		font-size: 0.8125rem;
		color: var(--ink-soft);
	}

	.cost {
		display: grid;
		gap: 40px;
		margin-top: 48px;
	}

	.cost h3 {
		font-family: var(--font-display);
		font-size: 1.375rem;
	}

	/* As parcelas do valor, no mesmo desenho da nota do pedido: nome, pontilhado e valor. */
	.parts {
		margin: 14px 0 0;
		padding: 12px 16px;
		background: var(--white);
		box-shadow: 0 1px 2px rgb(42 24 32 / 0.16);
		font-size: 0.9375rem;
	}

	.parts div {
		display: flex;
		align-items: baseline;
		gap: 8px;
		padding: 5px 0;
	}

	.parts dt {
		flex: 1;
		display: flex;
		align-items: baseline;
		gap: 8px;
		font-weight: 500;
	}

	.parts dt::after {
		content: '';
		flex: 1;
		min-width: 12px;
		border-bottom: 1.5px dotted var(--sakura);
		transform: translateY(-4px);
	}

	.parts dd {
		margin: 0;
		color: var(--ink-soft);
		white-space: nowrap;
	}

	.parts dd strong {
		font-variant-numeric: tabular-nums;
		color: var(--ink);
	}

	.note {
		max-width: 62ch;
		margin: 14px 0;
		font-size: 0.9375rem;
		color: var(--ink-soft);
	}

	.note strong {
		color: var(--ink);
	}

	details {
		border-top: 1px solid var(--line);
	}

	details:first-of-type {
		margin-top: 12px;
	}

	details:last-of-type {
		border-bottom: 1px solid var(--line);
	}

	summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 48px;
		font-weight: 700;
		cursor: pointer;
		list-style: none;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary::after {
		content: '+';
		font-family: var(--font-display);
		font-size: 1.375rem;
		line-height: 1;
		color: var(--beni);
	}

	details[open] summary::after {
		content: '−';
	}

	table {
		width: 100%;
		margin-bottom: 12px;
		border-collapse: collapse;
		font-size: 0.9375rem;
		font-variant-numeric: tabular-nums;
	}

	tbody th,
	td {
		padding: 5px 0;
		font-weight: 400;
		text-align: left;
		color: var(--ink-soft);
	}

	td {
		font-weight: 700;
		text-align: right;
		color: var(--ink);
	}

	@media (min-width: 900px) {
		section {
			padding-top: 112px;
		}

		.intro {
			grid-template-columns: minmax(0, 1fr) 520px;
			gap: 56px;
			align-items: end;
			margin-bottom: 40px;
		}

		figure {
			margin: 0;
		}

		figcaption {
			padding: 8px 0 0;
		}

		.cost {
			grid-template-columns: 1.15fr 1fr;
			gap: 72px;
			margin-top: 64px;
		}
	}
</style>
