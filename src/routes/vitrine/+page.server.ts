import { listCategories, listProducts } from '#lib/server/catalog.ts';
import type { PageServerLoad } from './$types';

const MAX_SEARCH_LENGTH = 80;

export const load: PageServerLoad = async ({ url }) => {
	const categories = await listCategories();

	// Categoria desconhecida (link antigo, slug digitado errado) mostra a vitrine inteira.
	const requestedCategory = url.searchParams.get('categoria');
	const activeCategory =
		categories.find((category) => category.slug === requestedCategory)?.slug ?? null;

	// O texto volta como foi digitado (sem trim) para o campo de busca não mudar enquanto a pessoa digita.
	const search = (url.searchParams.get('busca') ?? '').slice(0, MAX_SEARCH_LENGTH);

	const products = await listProducts({ categorySlug: activeCategory ?? undefined, search });

	return { categories, activeCategory, search, products };
};
