import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit/hooks';
import { findSessionUser, loginPathFor } from '#lib/server/auth.ts';

const ADMIN_LOGIN_PATH = '/admin/login';

function isUnder(pathname: string, base: string): boolean {
	return pathname === base || pathname.startsWith(`${base}/`);
}

// As áreas restritas são protegidas aqui, e não no `load` de um layout, porque um layout
// não é executado antes das form actions das páginas.
export const handle: Handle = async ({ event, resolve }) => {
	const user = await findSessionUser(event.cookies);
	event.locals.user = user;

	const { pathname } = event.url;

	if (isUnder(pathname, '/admin')) {
		const isAdmin = user?.role === 'admin';
		const isLoginPath = pathname === ADMIN_LOGIN_PATH;
		if (!isAdmin && !isLoginPath) redirect(303, ADMIN_LOGIN_PATH);
		if (isAdmin && isLoginPath) redirect(303, '/admin');
	}

	if (isUnder(pathname, '/conta') && !user) {
		redirect(303, loginPathFor(pathname));
	}

	return resolve(event);
};
