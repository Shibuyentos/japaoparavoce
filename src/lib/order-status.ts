import type { OrderStatus } from './types.ts';

// A ordem das chaves é a ordem em que os status aparecem nos filtros e no seletor.
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
	received: 'Recebido',
	quoted: 'Orçamento enviado',
	paid: 'Pago',
	shipped: 'Enviado',
	cancelled: 'Cancelado'
};
