// Deixa o texto sem acentos, minúsculo e só com letras e números,
// para "Pêssego", "pessego" e "PÊSSEGO" encontrarem o mesmo produto.
export function normalizeSearchText(text: string): string {
	return text
		.normalize('NFD')
		.replace(/\p{M}/gu, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, ' ')
		.trim();
}

type SearchableProduct = { name: string; descriptionPt: string; descriptionEn: string };

export function productSearchText(product: SearchableProduct): string {
	return normalizeSearchText(`${product.name} ${product.descriptionPt} ${product.descriptionEn}`);
}
