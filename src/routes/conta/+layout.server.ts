import { requireUser } from '#lib/server/auth.ts';
import type { LayoutServerLoad } from './$types';

// hooks.server.ts já barra quem não está logado. Devolver o usuário aqui dá às páginas
// da conta um `user` que nunca é nulo.
export const load: LayoutServerLoad = (event) => {
	return { user: requireUser(event) };
};
