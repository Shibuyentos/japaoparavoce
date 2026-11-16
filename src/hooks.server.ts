import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit/hooks';
import { findSessionUser } from '#lib/server/auth.ts';

const ADMIN_PATH = '/admin';
const LOGIN_PATH = '/admin/login';

// Todo o painel exige login. A checagem fica aqui, e não no `load` do layout, porque
// um layout não é executado antes das form actions das páginas.
export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;
	const isAdminPath = pathname === ADMIN_PATH || pathname.startsWith(`${ADMIN_PATH}/`);

	event.locals.user = isAdminPath ? await findSessionUser(event.cookies) : null;

	if (isAdminPath) {
		const isLoginPath = pathname === LOGIN_PATH;
		if (!event.locals.user && !isLoginPath) redirect(303, LOGIN_PATH);
		if (event.locals.user && isLoginPath) redirect(303, ADMIN_PATH);
	}

	return resolve(event);
};
