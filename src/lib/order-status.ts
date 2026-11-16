import type { OrderStatus } from './types.ts';

// A ordem das chaves é a ordem em que os status aparecem nos filtros e no seletor.
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
	received: 'Recebido',
	quoted: 'Orçamento enviado',
	paid: 'Pago',
	shipped: 'Enviado',
	cancelled: 'Cancelado'
};

type OrderStep = { status: OrderStatus; title: string; text: string };

// Os passos de um pedido, na ordem em que acontecem. "Cancelado" não é um passo, por isso fica fora.
export const ORDER_STEPS: OrderStep[] = [
	{
		status: 'received',
		title: 'Pedido recebido',
		text: 'O pedido chega pra mim com os itens e o destino da entrega.'
	},
	{
		status: 'quoted',
		title: 'Orçamento enviado',
		text: 'Confirmo preços e frete e mando o valor final no direct do Instagram.'
	},
	{
		status: 'paid',
		title: 'Pagamento confirmado',
		text: 'Com o pagamento combinado no direct, vou até a loja e compro os produtos.'
	},
	{
		status: 'shipped',
		title: 'Caixa postada',
		text: 'Embalo, posto no correio e mando o código de rastreio no direct.'
	}
];

// O que a cliente lê no topo da página do pedido, conforme o status.
export const ORDER_STATUS_MESSAGES: Record<OrderStatus, { title: string; text: string }> = {
	received: {
		title: 'Pedido recebido',
		text: 'Falta um passo: envie o resumo do pedido no direct do Instagram. É na conversa que eu confirmo os valores e a gente combina o pagamento.'
	},
	quoted: {
		title: 'Orçamento enviado',
		text: 'Mandei o orçamento no direct do Instagram. Confira os valores e combine o pagamento por lá.'
	},
	paid: {
		title: 'Pagamento confirmado',
		text: 'Agora é comigo: vou até a loja, compro seus produtos, embalo e posto no correio.'
	},
	shipped: {
		title: 'Caixa postada',
		text: 'Sua caixa já está no correio. O código de rastreio está na nossa conversa no direct.'
	},
	cancelled: {
		title: 'Pedido cancelado',
		text: 'Este pedido foi cancelado. Se ficou alguma dúvida, me chama no direct do Instagram.'
	}
};
