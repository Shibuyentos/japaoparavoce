<script lang="ts">
	const notices = [
		{
			title: 'Pagamento sempre antes da compra',
			text: 'O pagamento é combinado na conversa, no direct do Instagram, onde confirmamos o valor final. Eu só vou à loja depois do pagamento confirmado: é assim que consigo comprar sem adiantar do meu bolso.'
		},
		{
			title: 'Imposto de alfândega é do cliente',
			text: 'Se o seu país cobrar imposto na chegada, esse valor é por sua conta. Ele não está incluído no total.'
		},
		{
			title: 'Prazo é estimativa do correio',
			text: 'O tempo de entrega depende do correio e da alfândega do seu país. É uma estimativa, não uma promessa de data.'
		},
		{
			title: 'Itens que não podem ser enviados',
			text: 'Perfumes, sprays e aerossóis, remédios, alimentos perecíveis e baterias soltas não vão pelo correio internacional. Eu confiro antes de aceitar o seu pedido.'
		},
		{
			title: 'Só produtos novos e originais',
			text: 'Tudo é comprado novo em lojas do Japão. Nada de produto usado ou réplica.'
		},
		{
			title: 'Encomenda não tem troca por arrependimento',
			text: 'Como o produto é comprado só pra você, não dá pra trocar se você mudar de ideia. Se chegar errado ou danificado, a gente resolve: a política é combinada na conversa.'
		},
		{
			title: 'A tabela de frete pode mudar',
			text: 'O Japan Post anunciou aumento do EMS a partir de fevereiro/2027. O orçamento usa a tabela vigente na data do seu pedido.'
		},
		{
			title: 'Guarde o seu código de rastreio',
			text: 'É com ele que você acompanha sua caixa até a entrega. Guarde a mensagem onde eu te mando o código.'
		}
	];
</script>

<section id="avisos">
	<div class="wrap wrap-wide">
		<h2>Leia antes de pedir</h2>

		<dl>
			{#each notices as notice (notice.title)}
				<div>
					<dt>{notice.title}</dt>
					<dd>{notice.text}</dd>
				</div>
			{/each}
		</dl>
	</div>
</section>

<style>
	section {
		padding-top: 72px;
	}

	dl {
		margin: 20px 0 0;
		border-bottom: 1px solid var(--line);
	}

	dl div {
		padding: 14px 0;
		border-top: 1px solid var(--line);
	}

	dt {
		font-weight: 700;
	}

	dd {
		max-width: 62ch;
		margin: 2px 0 0;
		font-size: 0.9375rem;
		color: var(--ink-soft);
	}

	@media (min-width: 900px) {
		section {
			padding-top: 112px;
		}

		dl {
			display: grid;
			grid-template-columns: 1fr 1fr;
			column-gap: 72px;
			margin-top: 32px;
			border-bottom: none;
		}

		dl div {
			padding: 18px 0;
		}
	}
</style>
