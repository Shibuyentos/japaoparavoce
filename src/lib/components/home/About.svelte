<script lang="ts">
	import InstagramIcon from '#lib/components/InstagramIcon.svelte';
	import { INSTAGRAM_HANDLE, INSTAGRAM_URL, STORE_NAME } from '#lib/config.ts';
</script>

<section class="about" aria-labelledby="quem-titulo">
	<div class="wrap layout">
		<figure>
			<img
				src="/images/site/corredor-840.webp"
				srcset="/images/site/corredor-480.webp 480w, /images/site/corredor-840.webp 840w"
				sizes="(min-width: 900px) 440px, 100vw"
				width="840"
				height="1493"
				alt="Corredor de skincare de uma loja Don Quijote, com prateleiras cheias de produtos e etiquetas de preço"
				loading="lazy"
			/>
			<figcaption>Corredor de skincare de uma Don Quijote, no Japão.</figcaption>
		</figure>

		<div class="text">
			<h2 id="quem-titulo">Quem compra pra você</h2>
			<p class="lead">
				Eu moro no Japão e faço cada compra pessoalmente, em lojas como a Don Quijote. Confiro o
				preço na etiqueta, pego o produto novo na prateleira, embalo com cuidado e posto pelo
				correio daqui.
			</p>
			<p class="lead">
				É tudo comigo, do orçamento ao código de rastreio. Ficou com alguma dúvida antes de pedir? É
				só me chamar.
			</p>

			<div class="signature">
				<img src="/images/site/icone-192.webp" alt="" width="48" height="48" loading="lazy" />
				<span>
					<strong>{STORE_NAME}</strong>
					{INSTAGRAM_HANDLE}
				</span>
			</div>

			<a class="btn btn-quiet" href={INSTAGRAM_URL} target="_blank" rel="external noopener">
				<InstagramIcon />Falar comigo no direct
			</a>
		</div>
	</div>
</section>

<style>
	.about {
		margin-top: var(--section-gap);
	}

	.layout {
		display: grid;
		gap: 28px;
	}

	figure {
		margin: 0;
	}

	figure img {
		width: 100%;
		height: auto;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		object-position: center 60%;
		border-radius: var(--radius-l);
	}

	figcaption {
		margin-top: 8px;
		font-size: 0.8125rem;
		color: var(--ink-soft);
	}

	.lead + .lead {
		margin-top: 14px;
	}

	.signature {
		display: flex;
		align-items: center;
		gap: 12px;
		margin: 24px 0 20px;
		font-size: 0.9375rem;
		color: var(--ink-soft);
	}

	.signature img {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		box-shadow: 0 0 0 1px var(--line);
	}

	.signature strong {
		display: block;
		font-stretch: var(--wide);
		font-weight: 650;
		color: var(--ink);
	}

	@media (min-width: 900px) {
		.layout {
			grid-template-columns: 440px minmax(0, 1fr);
			gap: 72px;
			align-items: center;
		}

		figure img {
			aspect-ratio: 4 / 5;
		}
	}
</style>
