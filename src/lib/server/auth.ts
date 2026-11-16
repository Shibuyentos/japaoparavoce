import { createHash, randomBytes } from 'node:crypto';
import type { Cookies } from '@sveltejs/kit';
import { and, eq, gt, lt } from 'drizzle-orm';
import type { AdminUser } from '#lib/types.ts';
import { db } from './db';
import { sessions, users } from './db/schema';
import { verifyPassword } from './password';

const COOKIE_NAME = 'session';
const SESSION_SECONDS = 60 * 60 * 24 * 30;

// O cookie só é enviado para o painel, não para as páginas da loja.
const COOKIE_PATH = '/admin';

function sessionId(token: string): string {
	return createHash('sha256').update(token).digest('hex');
}

export function normalizeEmail(email: string): string {
	return email.trim().toLowerCase();
}

// Devolve false tanto para e-mail desconhecido quanto para senha errada, para a
// tela de login não revelar quais e-mails têm conta.
export async function logIn(cookies: Cookies, email: string, password: string): Promise<boolean> {
	const user = await db.query.users.findFirst({ where: eq(users.email, normalizeEmail(email)) });
	if (!user || !(await verifyPassword(password, user.passwordHash))) return false;

	const now = Date.now();
	await db.delete(sessions).where(lt(sessions.expiresAt, new Date(now)));

	const token = randomBytes(32).toString('base64url');
	await db.insert(sessions).values({
		id: sessionId(token),
		userId: user.id,
		expiresAt: new Date(now + SESSION_SECONDS * 1000)
	});
	cookies.set(COOKIE_NAME, token, { path: COOKIE_PATH, maxAge: SESSION_SECONDS });
	return true;
}

export async function findSessionUser(cookies: Cookies): Promise<AdminUser | null> {
	const token = cookies.get(COOKIE_NAME);
	if (!token) return null;

	const [user] = await db
		.select({ id: users.id, name: users.name, email: users.email })
		.from(sessions)
		.innerJoin(users, eq(users.id, sessions.userId))
		.where(and(eq(sessions.id, sessionId(token)), gt(sessions.expiresAt, new Date())));

	return user ?? null;
}

export async function logOut(cookies: Cookies): Promise<void> {
	const token = cookies.get(COOKIE_NAME);
	if (token) await db.delete(sessions).where(eq(sessions.id, sessionId(token)));
	cookies.delete(COOKIE_NAME, { path: COOKIE_PATH });
}
