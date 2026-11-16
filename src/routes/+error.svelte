<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { STORE_NAME } from '#lib/config.ts';

	const notFound = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{notFound ? 'Página não encontrada' : 'Algo deu errado'} · {STORE_NAME}</title>
</svelte:head>

<section>
	<div class="wrap">
		<span class="kicker">Erro {page.status}</span>
		{#if notFound}
			<h1>Não encontrei essa página</h1>
			<p class="lead">
				O link pode estar desatualizado ou o produto saiu da vitrine. Dá uma olhada nos produtos
				disponíveis agora.
			</p>
		{:else}
			<h1>Algo deu errado</h1>
			<p class="lead">Tente de novo em alguns instantes.</p>
		{/if}
		<a class="btn btn-primary" href={resolve('/vitrine')}>Ver a vitrine</a>
	</div>
</section>

<style>
	h1 {
		font-size: clamp(28px, 6vw, 40px);
		font-weight: 800;
	}

	.btn {
		margin-top: 24px;
	}
</style>
