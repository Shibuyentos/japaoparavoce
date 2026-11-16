import { createHash, randomBytes } from 'node:crypto';
import { redirect, type Cookies } from '@sveltejs/kit';
import { and, eq, gt, lt, or } from 'drizzle-orm';
import type { SessionUser } from '#lib/types.ts';
import { db } from './db';
import { sessions, users } from './db/schema';
import { verifyPassword } from './password';

const COOKIE_NAME = 'session';
const SESSION_SECONDS = 60 * 60 * 24 * 30;

function sessionId(token: string): string {
	return createHash('sha256').update(token).digest('hex');
}

export function normalizeEmail(email: string): string {
	return email.trim().toLowerCase();
}

// Devolve null tanto para e-mail desconhecido quanto para senha errada: quem chama
// mostra a mesma mensagem nos dois casos.
export async function authenticate(email: string, password: string): Promise<SessionUser | null> {
	const user = await db.query.users.findFirst({ where: eq(users.email, normalizeEmail(email)) });
	if (!user || !(await verifyPassword(password, user.passwordHash))) return null;

	return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function startSession(cookies: Cookies, userId: number): Promise<void> {
	const now = Date.now();
	const previousToken = cookies.get(COOKIE_NAME);

	// Aproveita o login para apagar as sessões vencidas e a que este navegador estava usando.
	await db
		.delete(sessions)
		.where(
			or(
				lt(sessions.expiresAt, new Date(now)),
				previousToken ? eq(sessions.id, sessionId(previousToken)) : undefined
			)
		);

	const token = randomBytes(32).toString('base64url');
	await db.insert(sessions).values({
		id: sessionId(token),
		userId,
		expiresAt: new Date(now + SESSION_SECONDS * 1000)
	});
	cookies.set(COOKIE_NAME, token, { path: '/', maxAge: SESSION_SECONDS });
}

export async function findSessionUser(cookies: Cookies): Promise<SessionUser | null> {
	const token = cookies.get(COOKIE_NAME);
	if (!token) return null;

	const [user] = await db
		.select({ id: users.id, name: users.name, email: users.email, role: users.role })
		.from(sessions)
		.innerJoin(users, eq(users.id, sessions.userId))
		.where(and(eq(sessions.id, sessionId(token)), gt(sessions.expiresAt, new Date())));

	return user ?? null;
}

export async function endSession(cookies: Cookies): Promise<void> {
	const token = cookies.get(COOKIE_NAME);
	if (token) await db.delete(sessions).where(eq(sessions.id, sessionId(token)));
	cookies.delete(COOKIE_NAME, { path: '/' });
}

export function loginPathFor(pathname: string): string {
	return `/entrar?destino=${encodeURIComponent(pathname)}`;
}

// Para loads e actions que só valem com login: devolve quem está logado ou manda para a
// tela de entrar, voltando depois para a página atual.
export function requireUser(event: { locals: App.Locals; url: URL }): SessionUser {
	if (!event.locals.user) redirect(303, loginPathFor(event.url.pathname));
	return event.locals.user;
}

// Depois do login a pessoa volta para onde estava (?destino=...). Só valem caminhos do
// próprio site, para um link de login não conseguir mandar ninguém a outro domínio.
export function destinationAfterLogin(url: URL, fallback: string): string {
	const destination = url.searchParams.get('destino') ?? '';
	return /^\/(?![/\\])/.test(destination) ? destination : fallback;
}
