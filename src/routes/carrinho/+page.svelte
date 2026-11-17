<script lang="ts">
	import Minus from '@lucide/svelte/icons/minus';
	import Plus from '@lucide/svelte/icons/plus';
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import OrderSummary from '#lib/components/OrderSummary.svelte';
	import ProductThumb from '#lib/components/ProductThumb.svelte';
	import TextField from '#lib/components/TextField.svelte';
	import { STORE_NAME } from '#lib/config.ts';
	import { countLabel, formatJpy, weightBandLabel } from '#lib/format.ts';
	import { loginHref, productHref, registerHref } from '#lib/links.ts';
	import type { PageProps, SubmitFunction } from './$types';

	let { data, form }: PageProps = $props();

	const quote = $derived(data.quote);
	const hasReferencePrice = $derived(quote.lines.some((line) => line.priceType === 'reference'));

	// O enhance padrão limpa o formulário depois do envio, o que voltaria o seletor
	// para a região anterior.
	const keepSelection: SubmitFunction = () => {
		return ({ update }) => update({ reset: false });
	};

	let sending = $state(false);

	const sendOrder: SubmitFunction = () => {
		sending = true;

		return async ({ update }) => {
			await update();
			sending = false;
		};
	};

	const nextSteps = [
		'Você envia o pedido. Nada é cobrado agora.',
		'Eu confiro preços e frete e te mando o orçamento final no direct do Instagram.',
		'Você paga e eu compro na loja. Depois, o rastreio aparece no seu pedido.'
	];
</script>

<svelte:head>
	<title>Carrinho · {STORE_NAME}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="wrap">
	<header class="page-head">
		<h1>Carrinho</h1>
		{#if quote.lines.length > 0}
			<p class="lead">
				{countLabel(quote.totals.itemCount, 'item', 'itens')}. Confira os produtos e o destino da
				entrega: o total já inclui fretes e taxa.
			</p>
		{/if}
	</header>

	{#if form?.message}
		<p class="notice" role="alert">{form.message}</p>
	{/if}

	{#if quote.lines.length === 0}
		<div class="empty">
			<p>
				Seu carrinho está vazio. Escolha os produtos na vitrine e eles aparecem aqui, com o frete e
				a taxa já somados.
			</p>
			<a class="btn btn-primary" href={resolve('/vitrine')}>Ver a vitrine</a>
			<p class="track">
				Já enviou um pedido? <a href={resolve('/conta/pedidos')}>Acompanhe em Meus pedidos</a>
			</p>
		</div>
	{:else}
		<div class="columns">
			<section aria-labelledby="itens-titulo">
				<h2 id="itens-titulo" class="visually-hidden">Produtos</h2>
				<ul class="lines">
					{#each quote.lines as line (line.slug)}
						<li>
							<ProductThumb image={line.image} name={line.name} size={76} />

							<div class="info">
								<a href={productHref(line.slug)}>{line.name}</a>
								<span class="meta">
									<span class="price">{formatJpy(line.unitPriceJpy)}</span> cada, frete {weightBandLabel(
										line.weightGrams
									)}
								</span>
								{#if line.priceType === 'reference'}
									<span class="meta">Preço de referência, confirmado no orçamento.</span>
								{/if}
							</div>

							<form class="controls" method="POST" action="?/update" use:enhance>
								<input type="hidden" name="slug" value={line.slug} />
								<div class="quantity">
									<button
										name="quantity"
										value={line.quantity - 1}
										disabled={line.quantity <= 1}
										aria-label="Diminuir quantidade de {line.name}"
									>
										<Minus />
									</button>
									<span>
										<span class="visually-hidden">Quantidade:</span>
										{line.quantity}
									</span>
									<button
										name="quantity"
										value={line.quantity + 1}
										disabled={line.quantity >= data.maxQuantity}
										aria-label="Aumentar quantidade de {line.name}"
									>
										<Plus />
									</button>
								</div>
								<button class="remove" name="quantity" value="0">
									Remover<span class="visually-hidden"> {line.name}</span>
								</button>
							</form>

							<strong class="line-total price"
								>{formatJpy(line.unitPriceJpy * line.quantity)}</strong
							>
						</li>
					{/each}
				</ul>
				<a class="text-link" href={resolve('/vitrine')}>Escolher mais produtos</a>
			</section>

			<div class="side">
				<section aria-labelledby="valores-titulo">
					<h2 id="valores-titulo">Resumo</h2>

					<form class="region" method="POST" action="?/region" use:enhance={keepSelection}>
						<label for="region">Entrega para</label>
						<select
							id="region"
							name="region"
							value={quote.region.code}
							onchange={(event) => event.currentTarget.form?.requestSubmit()}
						>
							{#each data.regions as region (region.code)}
								<option value={region.code}>{region.name}</option>
							{/each}
						</select>
						<noscript><button class="btn btn-quiet">Atualizar frete</button></noscript>
					</form>

					<OrderSummary charges={quote.charges} totals={quote.totals} />

					<p class="note">
						<strong>É uma estimativa.</strong> O frete é confirmado depois de pesar a caixa, sempre antes
						da postagem; se mudar, eu aviso e só sigo com a sua aprovação. Imposto de alfândega não incluído.
					</p>
					{#if hasReferencePrice}
						<p class="note">
							Itens com preço de referência têm o valor exato confirmado no orçamento, antes do
							pagamento.
						</p>
					{/if}
				</section>

				<section id="enviar" class="send" aria-labelledby="dados-titulo">
					<h2 id="dados-titulo">Enviar o pedido</h2>
					<ol class="next">
						{#each nextSteps as step, index (step)}
							<li><span class="number" aria-hidden="true">{index + 1}</span>{step}</li>
						{/each}
					</ol>

					{#if data.user}
						<form class="form" method="POST" action="?/checkout" use:enhance={sendOrder}>
							<TextField
								name="name"
								label="Seu nome"
								autocomplete="name"
								maxlength={80}
								required
								value={form?.values?.name ?? data.user.name}
								error={form?.errors?.name}
							/>
							<TextField
								name="instagram"
								label="Seu Instagram"
								placeholder="@seunome"
								autocapitalize="none"
								autocomplete="off"
								spellcheck="false"
								maxlength={31}
								required
								value={form?.values?.instagram ?? ''}
								hint="É por ele que eu te mando o orçamento no direct."
								error={form?.errors?.instagram}
							/>

							<div>
								<label for="note">Observação <span class="optional">(opcional)</span></label>
								<textarea
									id="note"
									name="note"
									rows="3"
									maxlength="500"
									placeholder="Cor, tamanho, dúvida sobre algum item"
									aria-invalid={form?.errors?.note ? 'true' : undefined}
									aria-describedby={form?.errors?.note ? 'note-error' : undefined}
									>{form?.values?.note ?? ''}</textarea
								>
								{#if form?.errors?.note}
									<p class="field-error" id="note-error">{form.errors.note}</p>
								{/if}
							</div>

							<button class="btn btn-primary" disabled={sending}>
								{sending ? 'Enviando…' : 'Enviar pedido'}
							</button>
						</form>
					{:else}
						<p class="note">
							Para enviar, entre na sua conta ou crie uma: é nela que você acompanha o pedido. Os
							produtos continuam no carrinho enquanto isso.
						</p>
						<div class="login">
							<a class="btn btn-primary" href={loginHref(resolve('/carrinho'))}>Entrar</a>
							<a class="btn btn-quiet" href={registerHref(resolve('/carrinho'))}>Criar conta</a>
						</div>
					{/if}
				</section>
			</div>
		</div>
	{/if}
</div>

<style>
	.wrap > .notice {
		margin-top: 20px;
	}

	h2 {
		font-size: 1.25rem;
	}

	.empty {
		max-width: 520px;
		margin-top: 16px;
	}

	.empty p {
		color: var(--ink-soft);
	}

	.empty .btn {
		margin-top: 20px;
	}

	.empty .track {
		margin-top: 28px;
		font-size: 0.9375rem;
	}

	.columns {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 40px;
		margin-top: 24px;
	}

	.lines {
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--line);
		list-style: none;
	}

	.lines li {
		display: grid;
		grid-template-columns: 76px minmax(0, 1fr) auto;
		gap: 12px 14px;
		align-items: center;
		padding: 16px 0;
		border-bottom: 1px solid var(--line);
	}

	.info {
		grid-column: 2 / -1;
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.info a {
		font-weight: 500;
		line-height: 1.35;
		color: var(--ink);
		text-decoration: none;
	}

	.info a:hover {
		text-decoration: underline;
	}

	.meta {
		font-size: 0.8125rem;
		color: var(--ink-soft);
	}

	.meta .price {
		font-size: 0.875rem;
		color: var(--ink);
	}

	.controls {
		grid-column: 1 / 3;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.quantity {
		display: inline-flex;
		align-items: center;
		border: 1.5px solid var(--line-strong);
		border-radius: 10px;
		background: var(--surface);
	}

	.quantity > span {
		min-width: 28px;
		font-weight: 650;
		font-variant-numeric: tabular-nums;
		text-align: center;
	}

	.quantity button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 42px;
		border: none;
		border-radius: 8px;
		background: none;
		color: var(--ink);
		cursor: pointer;
	}

	.quantity button:hover:not(:disabled) {
		background: var(--blush);
	}

	.quantity button:disabled {
		opacity: 0.3;
		cursor: default;
	}

	.quantity :global(svg) {
		width: 17px;
		height: 17px;
	}

	.remove {
		min-height: 44px;
		padding: 0 8px;
		border: none;
		background: none;
		font-family: inherit;
		font-size: 0.875rem;
		color: var(--ink-soft);
		text-decoration: underline;
		text-underline-offset: 0.2em;
		cursor: pointer;
	}

	.remove:hover {
		color: var(--danger);
	}

	.line-total {
		font-size: 1.0625rem;
	}

	.text-link {
		margin-top: 8px;
	}

	.side {
		display: grid;
		gap: 36px;
	}

	.region {
		display: grid;
		gap: 6px;
		margin: 14px 0 18px;
	}

	.note {
		margin-top: 14px;
		font-size: 0.875rem;
		color: var(--ink-soft);
	}

	.note strong {
		font-weight: 600;
		color: var(--ink);
	}

	.send {
		padding: 22px 18px;
		border: 1px solid var(--line);
		border-radius: var(--radius-l);
		background: var(--surface);
	}

	.next {
		display: grid;
		gap: 10px;
		margin: 14px 0 22px;
		padding: 0 0 18px;
		border-bottom: 1px solid var(--line);
		list-style: none;
		font-size: 0.9375rem;
		color: var(--ink-soft);
	}

	.next li {
		display: grid;
		grid-template-columns: 24px 1fr;
		gap: 10px;
	}

	.number {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--blush);
		font-size: 0.8125rem;
		font-stretch: var(--narrow);
		font-weight: 700;
		color: var(--beni);
	}

	.form label {
		margin-bottom: 6px;
	}

	.optional {
		font-weight: 400;
		color: var(--ink-soft);
	}

	.login {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 16px;
	}

	@media (min-width: 960px) {
		.columns {
			grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
			gap: 64px;
			align-items: start;
			margin-top: 32px;
		}

		.lines li {
			grid-template-columns: 76px minmax(0, 1fr) auto auto;
			gap: 20px;
		}

		.info {
			grid-column: auto;
		}

		.controls {
			grid-column: auto;
		}

		.send {
			padding: 28px;
		}
	}
</style>
