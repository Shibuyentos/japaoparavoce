<script lang="ts">
	import Ban from '@lucide/svelte/icons/ban';
	import Clock from '@lucide/svelte/icons/clock';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import Package from '@lucide/svelte/icons/package';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Search from '@lucide/svelte/icons/search';
	import ShieldCheck from '@lucide/svelte/icons/shield-check';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import Truck from '@lucide/svelte/icons/truck';
	import InstagramIcon from '#lib/components/InstagramIcon.svelte';
	import { INSTAGRAM_URL } from '#lib/config.ts';

	const notices = [
		{
			icon: CreditCard,
			title: 'Pagamento sempre antes da compra',
			text: 'O pagamento é combinado na conversa, no direct do Instagram, onde confirmamos o valor final. Eu só vou à loja depois do pagamento confirmado — é assim que consigo comprar sem adiantar do meu bolso.'
		},
		{
			icon: Package,
			title: 'Imposto de alfândega é do cliente',
			text: 'Se o seu país cobrar imposto na chegada, esse valor é por sua conta — ele não está incluído no total.'
		},
		{
			icon: Clock,
			title: 'Prazo é estimativa do correio',
			text: 'O tempo de entrega depende do correio e da alfândega do seu país. É uma estimativa, não uma promessa de data.'
		},
		{
			icon: Ban,
			title: 'Itens que não podem ser enviados',
			text: 'Perfumes, sprays e aerossóis, remédios, alimentos perecíveis e baterias soltas não vão pelo correio internacional. Eu confiro antes de aceitar o seu pedido.'
		},
		{
			icon: ShieldCheck,
			title: 'Só produtos novos e originais',
			text: 'Tudo é comprado novo em lojas do Japão. Nada de produto usado ou réplica.'
		},
		{
			icon: RotateCcw,
			title: 'Encomenda não tem troca por arrependimento',
			text: 'Como o produto é comprado só pra você, não dá pra trocar se você mudar de ideia. Se chegar errado ou danificado, a gente resolve — a política é combinada na conversa.'
		},
		{
			icon: TrendingUp,
			title: 'A tabela de frete pode mudar',
			text: 'O Japan Post anunciou aumento do EMS a partir de fevereiro/2027. O orçamento usa a tabela vigente na data do seu pedido.'
		},
		{
			icon: Search,
			title: 'Guarde o seu código de rastreio',
			text: 'É com ele que você acompanha sua caixa até a entrega. Guarde a mensagem onde eu te mando o código.'
		}
	];
</script>

<section id="avisos">
	<div class="wrap">
		<span class="kicker">Leia antes de pedir</span>
		<h2>Avisos importantes</h2>

		<div class="notices">
			<ul>
				{#each notices as notice (notice.title)}
					<li>
						<notice.icon />
						<div><strong>{notice.title}</strong>{notice.text}</div>
					</li>
				{/each}
			</ul>
		</div>

		<div class="shipping">
			<h3><Truck />Atenção ao frete internacional</h3>
			<p>
				O valor dos produtos <strong>não inclui o frete internacional</strong>. O valor exato do
				frete só sai com a sua caixa fechada e pesada, porque ele depende do peso final, das medidas
				da embalagem e do país de destino.
			</p>
		</div>

		<div class="final-cta">
			<h2>Pronta pra fazer seu primeiro pedido?</h2>
			<p>
				Me chama no Instagram com o link ou a foto do que você quer. Eu monto seu orçamento
				completo, sem compromisso.
			</p>
			<a class="btn btn-primary" href={INSTAGRAM_URL} target="_blank" rel="external noopener">
				<InstagramIcon />
				Pedir orçamento no Instagram
			</a>
		</div>
	</div>
</section>

<style>
	.notices {
		margin-top: 30px;
		background: var(--warn-bg);
		border: 1.5px solid var(--warn-line);
		border-radius: 24px;
		padding: 26px 22px;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;
	}

	li {
		display: flex;
		gap: 12px;
		color: var(--warn-ink);
		font-size: 16px;
	}

	li :global(svg) {
		width: 22px;
		height: 22px;
		flex: none;
		margin-top: 2px;
	}

	li strong {
		font-weight: 800;
		display: block;
	}

	@media (min-width: 760px) {
		.notices {
			padding: 32px 34px;
		}

		ul {
			grid-template-columns: 1fr 1fr;
			gap: 18px 30px;
		}
	}

	.shipping {
		margin-top: 30px;
		background: var(--surface);
		border: 1.5px solid var(--gold);
		border-radius: 24px;
		padding: 26px 22px;
		box-shadow: var(--shadow);
	}

	@media (min-width: 760px) {
		.shipping {
			padding: 32px 34px;
		}
	}

	.shipping h3 {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 21px;
	}

	.shipping h3 :global(svg) {
		width: 26px;
		height: 26px;
		stroke: var(--pink);
		flex: none;
	}

	.shipping p {
		margin: 10px 0 0;
		color: var(--muted);
		max-width: 68ch;
	}

	.final-cta {
		margin-top: 48px;
		background: var(--pink-bg);
		border: 1.5px solid var(--gold);
		border-radius: 24px;
		padding: 36px 24px;
		text-align: center;
	}

	.final-cta p {
		margin: 10px auto 0;
		max-width: 52ch;
		color: var(--muted);
	}

	.final-cta .btn {
		margin-top: 22px;
	}
</style>
