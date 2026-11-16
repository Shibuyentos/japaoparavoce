<script lang="ts">
	import Minus from '@lucide/svelte/icons/minus';
	import Plus from '@lucide/svelte/icons/plus';
	import Send from '@lucide/svelte/icons/send';
	import ShoppingBag from '@lucide/svelte/icons/shopping-bag';
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

<section>
	<div class="wrap">
		<span class="kicker">Monte seu pedido</span>
		<h1>Meu pedido 🧺</h1>

		{#if form?.message}
			<p class="alert" role="alert">{form.message}</p>
		{/if}

		{#if quote.lines.length === 0}
			<div class="empty">
				<p>
					Seu pedido está vazio por enquanto. Escolha os produtos na vitrine e eles aparecem aqui.
				</p>
				<a class="btn btn-primary" href={resolve('/vitrine')}><ShoppingBag />Ver a vitrine</a>
			</div>
		{:else}
			<p class="lead">
				Confira os itens, escolha pra onde vai a entrega e envie o pedido. O total já soma os
				produtos, os fretes e a taxa de serviço.
			</p>

			<div class="columns">
				<ul class="lines">
					{#each quote.lines as line (line.slug)}
						<li>
							<ProductThumb image={line.image} name={line.name} />

							<div class="info">
								<a href={productHref(line.slug)}>{line.name}</a>
								<span class="meta">
									{formatJpy(line.unitPriceJpy)} cada · {weightBandLabel(line.weightGrams)}
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
									<span aria-label="Quantidade">{line.quantity}</span>
									<button
										name="quantity"
										value={line.quantity + 1}
										disabled={line.quantity >= data.maxQuantity}
										aria-label="Aumentar quantidade de {line.name}"
									>
										<Plus />
									</button>
								</div>
								<button class="remove" name="quantity" value="0">Remover</button>
							</form>

							<strong class="line-total">{formatJpy(line.unitPriceJpy * line.quantity)}</strong>
						</li>
					{/each}
				</ul>

				<aside>
					<div class="panel">
						<h2>Resumo do pedido</h2>

						<form method="POST" action="?/region" use:enhance={keepSelection}>
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
							<noscript><button class="btn btn-ghost">Atualizar frete</button></noscript>
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
					</div>

					<form class="panel" method="POST" action="?/checkout" use:enhance={sendOrder}>
						<h2>Enviar pedido</h2>
						<p class="note">
							O pagamento é combinado depois, na conversa pelo direct do Instagram. Nada é cobrado
							aqui no site.
						</p>

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

						<label for="instagram">Seu Instagram</label>
						<input
							id="instagram"
							name="instagram"
							placeholder="@seunome"
							autocapitalize="none"
							autocomplete="off"
							maxlength="31"
							required
							value={form?.values?.instagram ?? ''}
							aria-invalid={form?.errors?.instagram ? 'true' : undefined}
							aria-describedby={form?.errors?.instagram ? 'instagram-error' : undefined}
						/>
						{#if form?.errors?.instagram}
							<p class="field-error" id="instagram-error">{form.errors.instagram}</p>
						{/if}

						<label for="note">Observação <span class="optional">(opcional)</span></label>
						<textarea
							id="note"
							name="note"
							rows="3"
							maxlength="500"
							placeholder="Cor, tamanho, dúvida sobre algum item…"
							aria-invalid={form?.errors?.note ? 'true' : undefined}
							aria-describedby={form?.errors?.note ? 'note-error' : undefined}
							>{form?.values?.note ?? ''}</textarea
						>
						{#if form?.errors?.note}
							<p class="field-error" id="note-error">{form.errors.note}</p>
						{/if}

						<button class="btn btn-primary" disabled={sending}>
							<Send />{sending ? 'Enviando…' : 'Enviar pedido'}
						</button>
					</form>
				</aside>
			</div>
		{/if}
	</div>
</section>

<style>
	section {
		padding-top: 36px;
	}

	h1 {
		font-size: clamp(26px, 5.4vw, 36px);
		font-weight: 800;
		color: var(--pink-title);
	}

	.alert {
		margin: 16px 0 0;
		background: var(--warn-bg);
		border: 1.5px solid var(--warn-line);
		border-radius: 14px;
		padding: 12px 16px;
		color: var(--warn-ink);
		font-weight: 700;
	}

	.empty {
		margin-top: 24px;
		text-align: center;
		background: #fff5f9;
		border: 1.5px dashed #f5a3c6;
		border-radius: 20px;
		padding: 32px 22px;
	}

	.empty p {
		margin: 0 auto 16px;
		max-width: 520px;
	}

	.columns {
		display: grid;
		gap: 24px;
		margin-top: 26px;
	}

	@media (min-width: 900px) {
		.columns {
			grid-template-columns: 1.25fr 1fr;
			align-items: start;
		}
	}

	.lines {
		list-style: none;
		margin: 0;
		padding: 0;
		border: 1px solid #f6d3e0;
		border-radius: var(--radius);
		box-shadow: var(--shadow-card);
	}

	.lines li {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 10px 12px;
		align-items: center;
		padding: 14px 16px;
		border-bottom: 1px dashed var(--line);
	}

	.lines li:last-child {
		border-bottom: none;
	}

	.info {
		display: flex;
		flex-direction: column;
		min-width: 0;
		grid-column: 2 / -1;
	}

	.info a {
		font-weight: 700;
		font-size: 15.5px;
		line-height: 1.35;
		color: var(--ink-strong);
		text-decoration: none;
	}

	.info a:hover {
		color: var(--pink-dark);
		text-decoration: underline;
	}

	.meta {
		font-size: 13.5px;
		color: var(--muted);
	}

	.controls {
		grid-column: 1 / 3;
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.quantity {
		display: inline-flex;
		align-items: center;
		border: 1.5px solid var(--line);
		border-radius: 999px;
		overflow: hidden;
	}

	.quantity span {
		min-width: 30px;
		text-align: center;
		font-weight: 800;
	}

	.quantity button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		border: none;
		background: var(--chip-bg);
		color: var(--pink-dark);
		cursor: pointer;
	}

	.quantity button:disabled {
		opacity: 0.4;
		cursor: default;
	}

	.quantity :global(svg) {
		width: 17px;
		height: 17px;
	}

	.remove {
		border: none;
		background: none;
		padding: 6px 2px;
		font-family: inherit;
		font-size: 14px;
		font-weight: 700;
		color: var(--muted);
		text-decoration: underline;
		cursor: pointer;
	}

	.remove:hover {
		color: var(--japan-red);
	}

	.line-total {
		font-size: 17px;
		white-space: nowrap;
	}

	aside {
		display: grid;
		gap: 18px;
	}

	.panel {
		display: flex;
		flex-direction: column;
		gap: 8px;
		background: var(--surface);
		border: 1px solid #f6d3e0;
		border-radius: var(--radius);
		box-shadow: var(--shadow-card);
		padding: 20px 18px 22px;
	}

	.panel h2 {
		font-size: 21px;
		color: var(--pink-title);
	}

	.panel form {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-bottom: 6px;
	}

	label {
		margin-top: 6px;
		font-size: 14.5px;
		font-weight: 800;
	}

	.optional {
		font-weight: 500;
		color: var(--muted);
	}

	input,
	select,
	textarea {
		width: 100%;
		font-family: inherit;
		font-size: 16px;
		color: var(--ink);
		background: #ffffff;
		border: 2px solid var(--pink-input);
		border-radius: 12px;
		padding: 10px 12px;
	}

	textarea {
		resize: vertical;
	}

	input:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: var(--pink);
		box-shadow: 0 0 0 4px rgba(236, 127, 168, 0.16);
	}

	[aria-invalid='true'] {
		border-color: var(--japan-red);
	}

	.field-error {
		margin: 0;
		font-size: 13.5px;
		font-weight: 700;
		color: var(--japan-red);
	}

	.note {
		margin: 4px 0 0;
		font-size: 14px;
		color: var(--muted);
	}

	.panel > .btn {
		margin-top: 12px;
	}
</style>
