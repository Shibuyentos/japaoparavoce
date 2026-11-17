<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { STORE_NAME } from '#lib/config.ts';

	const notFound = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{notFound ? 'Página não encontrada' : 'Algo deu errado'} · {STORE_NAME}</title>
</svelte:head>

<div class="wrap page-head">
	<p class="status">Erro {page.status}</p>
	{#if notFound}
		<h1>Não encontrei essa página</h1>
		<p class="lead">
			O link pode estar desatualizado ou o produto saiu da vitrine. Veja os produtos disponíveis
			agora ou acompanhe os seus pedidos.
		</p>
	{:else}
		<h1>Algo deu errado</h1>
		<p class="lead">Tente de novo em alguns instantes.</p>
	{/if}
	<div class="actions">
		<a class="btn btn-primary" href={resolve('/vitrine')}>Ver a vitrine</a>
		<a class="btn btn-quiet" href={resolve('/conta/pedidos')}>Meus pedidos</a>
	</div>
</div>

<style>
	.status {
		margin-bottom: 8px;
		font-size: 0.9375rem;
		color: var(--ink-soft);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 24px;
	}
</style>
