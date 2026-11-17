<script lang="ts">
	import { resolve } from '$app/paths';
	import Steps from '#lib/components/Steps.svelte';
	import { HOW_IT_WORKS_STEPS } from '#lib/how-it-works.ts';
</script>

<section class="how" aria-labelledby="como-funciona-titulo">
	<div class="wrap">
		<div class="heading">
			<h2 id="como-funciona-titulo">Do pedido até a sua casa</h2>
			<p class="lead">
				Você acompanha cada passo em "Meus pedidos", com a data em que ele aconteceu.
			</p>
		</div>
		<Steps steps={HOW_IT_WORKS_STEPS} />
		<a class="text-link" href={resolve('/como-funciona')}>
			Pagamento, prazos e o que não pode ser enviado
		</a>
	</div>
</section>

<style>
	.how {
		margin-top: var(--section-gap);
	}

	.heading {
		margin-bottom: 28px;
	}

	.text-link {
		margin-top: 20px;
	}

	@media (min-width: 900px) {
		.heading {
			margin-bottom: 40px;
		}

		.text-link {
			margin-top: 28px;
		}
	}
</style>
