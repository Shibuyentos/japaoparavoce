<script lang="ts">
	import { INSTAGRAM_HANDLE, INSTAGRAM_URL, STORE_NAME } from '#lib/config.ts';
</script>

<footer>
	<div class="wrap">
		<img src="/images/site/logo.webp" alt="" width="56" height="56" />
		<div class="name">{STORE_NAME}</div>
		<div>Produtos novos, direto das lojas do Japão 🇯🇵</div>
		<div>
			<a href={INSTAGRAM_URL} target="_blank" rel="external noopener">{INSTAGRAM_HANDLE}</a>
		</div>
	</div>
</footer>

<style>
	footer {
		padding: 44px 0 48px;
		text-align: center;
		color: var(--muted);
		font-size: 15px;
		border-top: 1px solid var(--line);
		margin-top: 12px;
	}

	.name {
		font-weight: 800;
		color: var(--ink);
		font-size: 17px;
	}

	a {
		font-weight: 700;
		text-decoration: none;
	}

	img {
		width: 56px;
		height: 56px;
		border-radius: 16px;
		margin: 0 auto 12px;
		object-fit: cover;
	}
</style>
