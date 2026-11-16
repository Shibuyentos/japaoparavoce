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

<div class="panel">
	<h2>Seus dados</h2>
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
</div>

<div class="actions">
	<a class="btn btn-primary" href={resolve('/conta/pedidos')}><Package />Meus pedidos</a>
	<a class="btn btn-ghost" href={resolve('/vitrine')}><ShoppingBag />Ver a vitrine</a>
</div>

<style>
	h1 {
		font-size: clamp(24px, 5vw, 32px);
		font-weight: 800;
		color: var(--pink-title);
	}

	.panel {
		margin-top: 20px;
		max-width: 560px;
	}

	h2 {
		font-size: 20px;
		color: var(--ink-strong);
	}

	dl {
		margin: 8px 0 0;
	}

	dl div {
		display: grid;
		grid-template-columns: 90px 1fr;
		gap: 12px;
		padding: 8px 0;
		border-bottom: 1px dashed var(--line);
		font-size: 15.5px;
	}

	dl div:last-child {
		border-bottom: none;
	}

	dt {
		color: var(--muted);
	}

	dd {
		margin: 0;
		font-weight: 700;
		overflow-wrap: anywhere;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 20px;
	}
</style>
