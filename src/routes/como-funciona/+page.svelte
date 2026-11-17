<script lang="ts">
	import { resolve } from '$app/paths';
	import InstagramIcon from '#lib/components/InstagramIcon.svelte';
	import Notices from '#lib/components/Notices.svelte';
	import Receipt from '#lib/components/Receipt.svelte';
	import ShippingTable from '#lib/components/ShippingTable.svelte';
	import Steps from '#lib/components/Steps.svelte';
	import { INSTAGRAM_URL, STORE_NAME } from '#lib/config.ts';
	import { formatJpy, formatWeight } from '#lib/format.ts';
	import { HOW_IT_WORKS_STEPS } from '#lib/how-it-works.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// A tabela EMS termina numa faixa máxima; acima dela o frete é combinado caso a caso.
	const heaviestBandGrams = $derived(
		Math.max(
			...data.shippingTable.flatMap((region) => region.rates.map((rate) => rate.maxWeightGrams))
		)
	);

	const payment = [
		{
			title: 'Enviar o pedido não cobra nada',
			text: 'O carrinho mostra o total estimado, com fretes e taxa. Ao enviar, o pedido chega pra mim e aparece em "Meus pedidos".'
		},
		{
			title: 'O orçamento final vem no direct',
			text: 'Confiro os preços e o frete e te mando o valor final no direct do Instagram. É ali que combinamos o pagamento.'
		},
		{
			title: 'Eu só compro depois do pagamento',
			text: 'Com o pagamento confirmado, vou até a loja. Se o frete mudar depois de pesar a caixa, eu aviso antes de postar e só sigo com a sua aprovação.'
		}
	];
</script>

<svelte:head>
	<title>Como funciona · {STORE_NAME}</title>
	<meta
		name="description"
		content="Como funciona a encomenda: pedido pelo site, orçamento no direct, pagamento antes da compra e envio pelo EMS com rastreio. Taxas, tabela de frete e avisos."
	/>
</svelte:head>

<div class="wrap">
	<header class="page-head">
		<h1>Como funciona</h1>
		<p class="lead">
			Tudo é sob encomenda: eu não tenho estoque. Compro os seus produtos numa loja do Japão depois
			que você aprova o orçamento e paga, e posto a caixa com rastreio.
		</p>
	</header>

	<section class="block" aria-label="Passo a passo">
		<Steps steps={HOW_IT_WORKS_STEPS} />
	</section>

	<section class="block" aria-labelledby="pagamento-titulo">
		<h2 id="pagamento-titulo">Quando você paga</h2>
		<ul class="payment">
			{#each payment as item (item.title)}
				<li>
					<h3>{item.title}</h3>
					<p>{item.text}</p>
				</li>
			{/each}
		</ul>
	</section>

	<section id="valores" class="block" aria-labelledby="valores-titulo">
		<h2 id="valores-titulo">Fretes e taxas</h2>
		<p class="lead">
			Cada produto sai pelo preço da etiqueta da loja, já com imposto. A cada pedido somam-se estes
			valores:
		</p>

		<div class="values">
			<div class="receipt">
				<Receipt>
					<dl>
						<div>
							<dt><span>Frete interno no Japão</span></dt>
							<dd class="price">{formatJpy(data.fees.domesticShippingJpy)}</dd>
						</div>
						<div>
							<dt><span>Taxa de serviço</span></dt>
							<dd class="price">{formatJpy(data.fees.serviceFeeJpy)}</dd>
						</div>
						<div>
							<dt><span>Frete internacional (EMS)</span></dt>
							<dd>pela tabela</dd>
						</div>
					</dl>
					<p class="receipt-note">
						A taxa de serviço é o meu trabalho de comprar, embalar e postar. Os três valores são por
						pedido, não por produto.
					</p>
				</Receipt>
			</div>

			<div class="table">
				<h3>Frete internacional (EMS)</h3>
				<p class="note">
					Pelo peso da caixa e pela região de entrega. Cada produto tem uma faixa de peso estimada,
					e o carrinho soma as faixas para escolher a linha da tabela.
				</p>
				<ShippingTable regions={data.shippingTable} />
				<p class="note">
					Acima de {formatWeight(heaviestBandGrams)}, o frete é combinado caso a caso. O valor exato
					sai com a caixa fechada e pesada, sempre antes da postagem.
				</p>
			</div>
		</div>
	</section>

	<div class="block">
		<Notices />
	</div>

	<section class="block closing" aria-labelledby="fechamento-titulo">
		<h2 id="fechamento-titulo">Pronta para escolher?</h2>
		<p class="lead">Se ficou alguma dúvida, me chama no direct antes de pedir.</p>
		<div class="actions">
			<a class="btn btn-primary" href={resolve('/vitrine')}>Ver a vitrine</a>
			<a class="btn btn-quiet" href={INSTAGRAM_URL} target="_blank" rel="external noopener">
				<InstagramIcon />Tirar uma dúvida
			</a>
		</div>
	</section>
</div>

<style>
	.block {
		margin-top: var(--section-gap);
	}

	.page-head + .block {
		margin-top: 40px;
	}

	.payment {
		display: grid;
		gap: 12px;
		margin: 24px 0 0;
		padding: 0;
		list-style: none;
	}

	.payment li {
		padding: 20px;
		border-radius: var(--radius);
		background: var(--blush);
	}

	.payment p {
		margin-top: 6px;
		font-size: 0.9375rem;
		color: var(--ink-soft);
	}

	/* Sem o minmax(0, ...), a largura mínima da tabela de frete alargaria a coluna no celular. */
	.values {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 40px;
		margin-top: 28px;
	}

	.receipt {
		max-width: 420px;
	}

	.receipt dd.price {
		font-size: 1rem;
	}

	.receipt-note {
		margin-top: 12px;
		padding-top: 12px;
		border-top: 1.5px dashed var(--line-strong);
		font-size: 0.875rem;
		color: var(--ink-soft);
	}

	.table h3 {
		font-size: 1.125rem;
	}

	.note {
		max-width: 62ch;
		margin: 6px 0 16px;
		font-size: 0.9375rem;
		color: var(--ink-soft);
	}

	.table .note:last-child {
		margin: 14px 0 0;
	}

	.closing {
		padding: 32px 24px;
		border-radius: var(--radius-l);
		background: var(--blush);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 22px;
	}

	@media (min-width: 900px) {
		.page-head + .block {
			margin-top: 56px;
		}

		.payment {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 20px;
		}

		.payment li {
			padding: 28px;
		}

		.values {
			grid-template-columns: 380px minmax(0, 1fr);
			gap: 64px;
			align-items: start;
		}

		.closing {
			padding: 56px;
		}
	}
</style>
