<script lang="ts">
	import Package from '@lucide/svelte/icons/package';
	import ShoppingBag from '@lucide/svelte/icons/shopping-bag';
	import { resolve } from '$app/paths';
	import { STORE_NAME } from '#lib/config.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Minha conta · {STORE_NAME}</title>
</svelte:head>

<h1>Olá, {data.user.name} 🌸</h1>

<section aria-labelledby="dados-titulo">
	<h2 id="dados-titulo">Seus dados</h2>
	<dl>
		<div>
			<dt>Nome</dt>
			<dd>{data.user.name}</dd>
		</div>
		<div>
			<dt>E-mail</dt>
			<dd>{data.user.email}</dd>
		</div>
	</dl>
</section>

<div class="actions">
	<a class="btn btn-primary" href={resolve('/conta/pedidos')}><Package />Meus pedidos</a>
	<a class="btn btn-quiet" href={resolve('/vitrine')}><ShoppingBag />Ver a vitrine</a>
</div>

<style>
	section {
		max-width: 560px;
		margin-top: 28px;
	}

	h2 {
		font-size: 1.375rem;
	}

	dl {
		margin: 12px 0 0;
		border-bottom: 1px solid var(--line);
	}

	dl div {
		display: grid;
		grid-template-columns: 90px 1fr;
		gap: 12px;
		padding: 10px 0;
		border-top: 1px solid var(--line);
		font-size: 0.9375rem;
	}

	dt {
		color: var(--ink-soft);
	}

	dd {
		margin: 0;
		font-weight: 700;
		overflow-wrap: anywhere;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 24px;
	}
</style>
