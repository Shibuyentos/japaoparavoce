import { STORE_NAME } from './config.ts';
import { formatBrl, formatJpy, formatWeight } from './format.ts';
import type { OrderDetails } from './types.ts';

// Texto que a cliente copia e cola no direct do Instagram para fechar o pedido.
export function orderSummaryText(order: OrderDetails): string {
	const { charges, totals } = order;

	const items = order.lines.map((line) => {
		const each = line.quantity > 1 ? ' cada' : '';
		const reference = line.priceType === 'reference' ? ' (preço de referência)' : '';
		return `• ${line.quantity}× ${line.name} — ${formatJpy(line.unitPriceJpy)}${each}${reference}`;
	});

	const total = `${formatJpy(totals.totalJpy)} (≈ ${formatBrl(totals.totalBrlCents)})`;
	const shipping =
		charges.internationalShippingJpy === null
			? [
					'Frete internacional: a combinar (peso acima da tabela)',
					`TOTAL ESTIMADO (sem o frete internacional): ${total}`
				]
			: [
					`Frete internacional (EMS): ${formatJpy(charges.internationalShippingJpy)}`,
					`TOTAL ESTIMADO: ${total}`
				];

	return [
		`🌸 Meu pedido — ${STORE_NAME} 🇯🇵`,
		`Código: ${order.code}`,
		'',
		'Itens:',
		...items,
		'',
		`Entrega: ${order.regionName}`,
		`Peso total estimado: ${formatWeight(totals.weightGrams)}`,
		`Produtos: ${formatJpy(totals.productsJpy)}`,
		`Frete interno no Japão: ${formatJpy(charges.domesticShippingJpy)}`,
		`Taxa de serviço: ${formatJpy(charges.serviceFeeJpy)}`,
		...shipping,
		'',
		'É uma estimativa: o valor final é confirmado depois de pesar a caixa, antes da postagem. Imposto de alfândega não incluído.'
	].join('\n');
}
