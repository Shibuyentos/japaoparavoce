<script lang="ts">
	import Package from '@lucide/svelte/icons/package';
	import ShoppingBag from '@lucide/svelte/icons/shopping-bag';
	import { resolve } from '$app/paths';
	import InstagramIcon from '#lib/components/InstagramIcon.svelte';
	import { INSTAGRAM_HANDLE, INSTAGRAM_URL, STORE_NAME } from '#lib/config.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const firstName = $derived(data.user.name.split(' ')[0]);
</script>

<svelte:head>
	<title>Minha conta · {STORE_NAME}</title>
</svelte:head>

<h1>Olá, {firstName}</h1>

<div class="layout">
	<ul class="shortcuts">
		<li>
			<a href={resolve('/conta/pedidos')}>
				<Package aria-hidden="true" />
				<span>
					<strong>Meus pedidos</strong>
					O andamento de cada pedido, com as datas e o rastreio.
				</span>
			</a>
		</li>
		<li>
			<a href={resolve('/vitrine')}>
				<ShoppingBag aria-hidden="true" />
				<span>
					<strong>Vitrine</strong>
					Os produtos que eu compro sob encomenda.
				</span>
			</a>
		</li>
		<li>
			<a href={INSTAGRAM_URL} target="_blank" rel="external noopener">
				<InstagramIcon />
				<span>
					<strong>Falar comigo</strong>
					Pelo direct do Instagram, {INSTAGRAM_HANDLE}.
				</span>
			</a>
		</li>
	</ul>

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
</div>

<style>
	.layout {
		display: grid;
		gap: 36px;
		margin-top: 24px;
	}

	.shortcuts {
		display: grid;
		gap: 10px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.shortcuts a {
		display: flex;
		align-items: flex-start;
		gap: 14px;
		padding: 18px;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--surface);
		font-size: 0.9375rem;
		color: var(--ink-soft);
		text-decoration: none;
	}

	.shortcuts a:hover {
		border-color: var(--sakura);
	}

	.shortcuts :global(svg) {
		flex: none;
		width: 22px;
		height: 22px;
		color: var(--beni);
	}

	.shortcuts strong {
		display: block;
		font-size: 1rem;
		font-weight: 650;
		color: var(--ink);
	}

	h2 {
		font-size: 1.25rem;
	}

	dl {
		margin: 12px 0 0;
		border-top: 1px solid var(--line);
	}

	dl div {
		display: grid;
		grid-template-columns: 80px 1fr;
		gap: 12px;
		padding: 12px 0;
		border-bottom: 1px solid var(--line);
		font-size: 0.9375rem;
	}

	dt {
		color: var(--ink-soft);
	}

	dd {
		margin: 0;
		font-weight: 600;
		overflow-wrap: anywhere;
	}

	@media (min-width: 900px) {
		.layout {
			grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr);
			gap: 64px;
			align-items: start;
		}
	}
</style>
