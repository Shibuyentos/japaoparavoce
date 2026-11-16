<script lang="ts">
	import Minus from '@lucide/svelte/icons/minus';
	import Plus from '@lucide/svelte/icons/plus';
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import OrderSummary from '#lib/components/OrderSummary.svelte';
	import ProductThumb from '#lib/components/ProductThumb.svelte';
	import { STORE_NAME } from '#lib/config.ts';
	import { formatJpy, weightBandLabel } from '#lib/format.ts';
	import { productHref } from '#lib/links.ts';
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
</script>

<svelte:head>
	<title>Meu pedido · {STORE_NAME}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="wrap page">
	<h1>Meu pedido</h1>

	{#if form?.message}
		<p class="notice" role="alert">{form.message}</p>
	{/if}

	{#if quote.lines.length === 0}
		<div class="empty">
			<p>
				Seu pedido ainda está vazio. Escolha os produtos na vitrine e eles aparecem aqui, com o
				frete e as taxas já somados.
			</p>
			<a class="btn btn-primary" href={resolve('/vitrine')}>Ver a vitrine</a>
			<p class="track">
				Já enviou um pedido? <a href={resolve('/pedidos')}>Acompanhe pelo código</a>
			</p>
		</div>
	{:else}
		<p class="lead">
			Confira os itens, escolha o destino e envie o pedido. Nada é cobrado aqui: o pagamento é
			combinado depois, no direct do Instagram.
		</p>

		<div class="columns">
			<section aria-labelledby="itens-titulo">
				<h2 id="itens-titulo">Itens</h2>
				<ul class="lines">
					{#each quote.lines as line (line.slug)}
						<li>
							<ProductThumb image={line.image} name={line.name} />

							<div class="info">
								<a href={productHref(line.slug)}>{line.name}</a>
								<span class="meta">
									{formatJpy(line.unitPriceJpy)} cada, frete {weightBandLabel(line.weightGrams)}
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

							<strong class="line-total">{formatJpy(line.unitPriceJpy * line.quantity)}</strong>
						</li>
					{/each}
				</ul>
				<a class="more" href={resolve('/vitrine')}>Escolher mais produtos</a>
			</section>

			<div class="side">
				<section aria-labelledby="valores-titulo">
					<h2 id="valores-titulo">Entrega e valores</h2>

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
						<strong>É uma estimativa:</strong> o frete é confirmado depois de pesar a sua caixa, sempre
						antes da postagem. Imposto de alfândega não incluído.
					</p>
					{#if hasReferencePrice}
						<p class="note">
							Itens com preço de referência têm o valor exato confirmado no orçamento, antes do
							pagamento.
						</p>
					{/if}
				</section>

				<section aria-labelledby="dados-titulo">
					<h2 id="dados-titulo">Seus dados</h2>

					<form class="checkout" method="POST" action="?/checkout" use:enhance={sendOrder}>
						<div>
							<label for="name">Seu nome</label>
							<input
								id="name"
								name="name"
								autocomplete="name"
								maxlength="80"
								required
								value={form?.values?.name ?? ''}
								aria-invalid={form?.errors?.name ? 'true' : undefined}
								aria-describedby={form?.errors?.name ? 'name-error' : undefined}
							/>
							{#if form?.errors?.name}
								<p class="field-error" id="name-error">{form.errors.name}</p>
							{/if}
						</div>

						<div>
							<label for="instagram">Seu Instagram</label>
							<input
								id="instagram"
								name="instagram"
								placeholder="@seunome"
								autocapitalize="none"
								autocomplete="off"
								spellcheck="false"
								maxlength="31"
								required
								value={form?.values?.instagram ?? ''}
								aria-invalid={form?.errors?.instagram ? 'true' : undefined}
								aria-describedby={form?.errors?.instagram
									? 'instagram-error instagram-hint'
									: 'instagram-hint'}
							/>
							<p class="hint" id="instagram-hint">É por ele que eu te encontro no direct.</p>
							{#if form?.errors?.instagram}
								<p class="field-error" id="instagram-error">{form.errors.instagram}</p>
							{/if}
						</div>

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
						<p class="note">
							Depois de enviar, você recebe um código e o resumo do pedido pra mandar no direct.
						</p>
					</form>
				</section>
			</div>
		</div>
	{/if}
</div>

<style>
	.page {
		padding-top: 32px;
	}

	.page > .notice {
		margin-top: 16px;
	}

	h2 {
		font-size: 1.375rem;
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
		gap: 40px;
		margin-top: 28px;
	}

	.lines {
		margin: 12px 0 0;
		padding: 0;
		border-bottom: 1px solid var(--line);
		list-style: none;
	}

	.lines li {
		display: grid;
		grid-template-columns: 64px 1fr auto;
		gap: 10px 14px;
		align-items: center;
		padding: 16px 0;
		border-top: 1px solid var(--line);
	}

	.info {
		grid-column: 2 / -1;
		display: flex;
		flex-direction: column;
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

	.controls {
		grid-column: 1 / 3;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.quantity {
		display: inline-flex;
		align-items: center;
		border: 1.5px solid var(--ink);
		border-radius: var(--radius);
		background: var(--white);
	}

	.quantity > span {
		min-width: 28px;
		font-weight: 700;
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
		background: none;
		color: var(--ink);
		cursor: pointer;
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
		text-underline-offset: 0.18em;
		cursor: pointer;
	}

	.remove:hover {
		color: var(--danger);
	}

	.line-total {
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.more {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		margin-top: 8px;
		font-weight: 700;
	}

	.side {
		display: grid;
		gap: 40px;
	}

	.region {
		display: grid;
		gap: 6px;
		margin: 12px 0 16px;
	}

	.note {
		margin-top: 12px;
		font-size: 0.875rem;
		color: var(--ink-soft);
	}

	.note strong {
		color: var(--ink);
	}

	.checkout {
		display: grid;
		gap: 16px;
		margin-top: 12px;
	}

	.checkout label {
		margin-bottom: 6px;
	}

	.optional {
		font-weight: 400;
		color: var(--ink-soft);
	}

	.hint {
		margin-top: 4px;
		font-size: 0.8125rem;
		color: var(--ink-soft);
	}

	.checkout .btn {
		margin-top: 4px;
	}

	.checkout .note {
		margin-top: -4px;
	}

	@media (min-width: 900px) {
		.page {
			padding-top: 48px;
		}

		.columns {
			grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
			gap: 72px;
			align-items: start;
			margin-top: 36px;
		}
	}
</style>
