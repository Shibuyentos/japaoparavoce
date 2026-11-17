<script lang="ts">
	import Plane from '@lucide/svelte/icons/plane';
	import ReceiptText from '@lucide/svelte/icons/receipt-text';
	import ShieldCheck from '@lucide/svelte/icons/shield-check';
	import Tag from '@lucide/svelte/icons/tag';
	import { resolve } from '$app/paths';

	let { productCount }: { productCount: number } = $props();

	const promises = [
		{
			icon: ShieldCheck,
			title: 'Só produto novo e original',
			text: 'Comprado em loja do Japão. Nada usado, nada de réplica.'
		},
		{
			icon: Tag,
			title: 'Preço da etiqueta da loja',
			text: 'O valor do caixa no Japão, já com imposto.'
		},
		{
			icon: ReceiptText,
			title: 'Você aprova o total antes de pagar',
			text: 'Produto, fretes e taxa somados. Eu só compro depois do pagamento.'
		},
		{
			icon: Plane,
			title: 'Envio com rastreio',
			text: 'Pelo EMS, o correio expresso do Japão, com código pra acompanhar.'
		}
	];
</script>

<section class="hero">
	<div class="wrap layout">
		<div class="intro">
			<h1>Eu compro no Japão e envio pra você.</h1>
			<p class="lead">
				Skincare japonês e coreano pelo preço da etiqueta da loja. Você vê o total com frete antes
				de pagar, e eu só vou às compras depois de tudo combinado.
			</p>
			<div class="actions">
				<a class="btn btn-primary" href={resolve('/vitrine')}>Ver os {productCount} produtos</a>
				<a class="btn btn-quiet" href={resolve('/como-funciona')}>Como funciona</a>
			</div>
		</div>

		<ul class="promises">
			{#each promises as promise (promise.title)}
				<li>
					<promise.icon aria-hidden="true" />
					<div>
						<strong>{promise.title}</strong>
						<span>{promise.text}</span>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.hero {
		padding: 32px 0 8px;
	}

	.layout {
		display: grid;
		gap: 32px;
	}

	h1 {
		max-width: 13ch;
		font-size: clamp(2.125rem, 9.4vw, 4.125rem);
		font-weight: 660;
		line-height: 1.03;
		letter-spacing: -0.025em;
	}

	.lead {
		max-width: 44ch;
		margin-top: 18px;
		font-size: 1.0625rem;
	}

	.actions {
		display: grid;
		gap: 10px;
		margin-top: 26px;
	}

	.promises {
		margin: 0;
		padding: 6px 18px;
		border: 1px solid var(--line);
		border-radius: var(--radius-l);
		background: var(--surface);
		list-style: none;
	}

	.promises li {
		display: grid;
		grid-template-columns: 26px 1fr;
		gap: 14px;
		padding: 14px 0;
	}

	.promises li + li {
		border-top: 1px solid var(--line);
	}

	.promises :global(svg) {
		width: 24px;
		height: 24px;
		margin-top: 1px;
		color: var(--beni);
		stroke-width: 1.8;
	}

	.promises strong {
		display: block;
		font-weight: 650;
		line-height: 1.3;
	}

	.promises span {
		display: block;
		margin-top: 2px;
		font-size: 0.9375rem;
		line-height: 1.45;
		color: var(--ink-soft);
	}

	@media (min-width: 560px) {
		.actions {
			display: flex;
		}
	}

	@media (min-width: 960px) {
		.hero {
			padding: 72px 0 16px;
		}

		.layout {
			grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
			gap: 64px;
			align-items: center;
		}

		.lead {
			font-size: 1.1875rem;
		}

		.promises {
			padding: 10px 28px;
		}

		.promises li {
			padding: 18px 0;
		}
	}
</style>
