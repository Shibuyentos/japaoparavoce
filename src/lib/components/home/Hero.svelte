<script lang="ts">
	import { resolve } from '$app/paths';
	import InstagramIcon from '#lib/components/InstagramIcon.svelte';
	import { INSTAGRAM_URL } from '#lib/config.ts';

	const commitments = [
		{
			title: 'Só produto novo',
			text: 'Comprado em loja do Japão. Nada de produto usado ou réplica.'
		},
		{
			title: 'Sob encomenda',
			text: 'Sem estoque: você vê o preço da loja e o orçamento completo antes de fechar.'
		},
		{
			title: 'Envio com rastreio',
			text: 'Embalo, posto no correio e te mando o código pra acompanhar a caixa.'
		}
	];
</script>

<section class="hero">
	<div class="wrap wrap-wide">
		<div class="top">
			<div class="text">
				<h1>Eu compro no Japão e envio pra você.</h1>
				<p class="lead">
					Moro no Japão. Você escolhe na vitrine ou me manda a foto do que quer; eu vou até a loja,
					compro o produto novo e posto pro Brasil e pro mundo.
				</p>
				<div class="actions">
					<a class="btn btn-primary" href={resolve('/vitrine')}>Ver a vitrine</a>
					<a class="btn btn-quiet" href={INSTAGRAM_URL} target="_blank" rel="external noopener">
						<InstagramIcon />Pedir orçamento
					</a>
				</div>
			</div>

			<!-- A foto fica "em pé" na primeira prateleira da página, como os produtos da vitrine. -->
			<figure>
				<img
					src="/images/site/corredor-840.webp"
					srcset="/images/site/corredor-480.webp 480w, /images/site/corredor-840.webp 840w"
					sizes="(min-width: 860px) 420px, 100vw"
					width="840"
					height="1493"
					alt="Corredor de skincare de uma loja no Japão, com prateleiras cheias de produtos e etiquetas de preço"
					fetchpriority="high"
				/>
				<figcaption>
					Foto ilustrativa: o corredor de skincare de uma Don Quijote, no Japão.
				</figcaption>
			</figure>
		</div>

		<ul class="commitments">
			{#each commitments as commitment (commitment.title)}
				<li>
					<strong>{commitment.title}</strong>
					{commitment.text}
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.hero {
		padding-top: 28px;
	}

	h1 {
		max-width: 12ch;
		font-size: clamp(2.5rem, 11.5vw, 4.75rem);
		line-height: 1.02;
		letter-spacing: -0.02em;
	}

	.lead {
		margin-top: 16px;
		max-width: 46ch;
	}

	.actions {
		display: flex;
		gap: 10px;
		margin-top: 22px;
	}

	.actions .btn {
		padding-inline: 16px;
		white-space: nowrap;
	}

	.actions .btn-primary {
		flex: 1;
	}

	figure {
		position: relative;
		margin: 28px calc(var(--gutter) * -1) 0;
	}

	figure img {
		width: 100%;
		height: auto;
		aspect-ratio: 5 / 4;
		object-fit: cover;
		object-position: center 62%;
	}

	figcaption {
		position: absolute;
		left: var(--gutter);
		bottom: 12px;
		max-width: calc(100% - var(--gutter) * 2);
		padding: 4px 8px;
		background: var(--white);
		font-size: 0.75rem;
		line-height: 1.4;
		color: var(--ink);
	}

	.commitments {
		display: grid;
		margin: 0 calc(var(--gutter) * -1);
		padding: 0 var(--gutter);
		border-top: 2px solid var(--ink);
		list-style: none;
	}

	.commitments li {
		padding: 14px 0;
		border-bottom: 1px solid var(--line);
		font-size: 0.9375rem;
		color: var(--ink-soft);
	}

	.commitments strong {
		display: block;
		font-size: 1rem;
		color: var(--ink);
	}

	@media (min-width: 560px) {
		.actions .btn-primary {
			flex: none;
		}
	}

	@media (min-width: 860px) {
		.hero {
			padding-top: 56px;
		}

		.top {
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(320px, 420px);
			gap: 56px;
			align-items: end;
		}

		.text {
			padding-bottom: 56px;
		}

		h1 {
			font-size: clamp(4rem, 6.4vw, 6rem);
		}

		.lead {
			font-size: 1.1875rem;
		}

		figure {
			margin: 0;
		}

		figure img {
			aspect-ratio: 4 / 5;
		}

		figcaption {
			left: 12px;
			max-width: calc(100% - 24px);
		}

		.commitments {
			grid-template-columns: repeat(3, 1fr);
			gap: 40px;
			margin: 0;
			padding: 0;
		}

		.commitments li {
			padding: 18px 0 0;
			border-bottom: none;
		}
	}
</style>
