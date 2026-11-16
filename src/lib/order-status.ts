import type { OrderStatus } from './types.ts';

// A ordem das chaves é a ordem em que os status aparecem nos filtros e no seletor.
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
	received: 'Recebido',
	quoted: 'Orçamento enviado',
	paid: 'Pago',
	shipped: 'Enviado',
	cancelled: 'Cancelado'
};

// Etapas por onde um pedido passa até chegar à cliente. "Cancelado" fica fora do caminho.
export const ORDER_PROGRESS: OrderStatus[] = ['received', 'quoted', 'paid', 'shipped'];
