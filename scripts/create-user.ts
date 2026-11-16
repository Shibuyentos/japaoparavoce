import { createInterface } from 'node:readline/promises';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../src/lib/server/db/schema.ts';
import { hashPassword } from '../src/lib/server/password.ts';

const MIN_PASSWORD_LENGTH = 10;

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

const [emailArgument, name] = process.argv.slice(2);
if (!emailArgument || !name) {
	console.error('Uso: npm run user:create -- email@exemplo.com "Nome da pessoa"');
	process.exit(1);
}
const email = emailArgument.trim().toLowerCase();

const terminal = createInterface({ input: process.stdin, output: process.stdout });
const password = await terminal.question(`Senha (mínimo ${MIN_PASSWORD_LENGTH} caracteres): `);
terminal.close();

if (password.length < MIN_PASSWORD_LENGTH) {
	console.error(`A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
	process.exit(1);
}

const db = drizzle(createClient({ url }), { schema, casing: 'snake_case' });
const passwordHash = await hashPassword(password);

// Rodar de novo com um e-mail já cadastrado troca o nome e a senha dessa pessoa.
// Se o e-mail for de uma cliente, a conta dela passa a ter acesso ao painel.
await db
	.insert(schema.users)
	.values({ email, name, passwordHash, role: 'admin' })
	.onConflictDoUpdate({
		target: schema.users.email,
		set: { name, passwordHash, role: 'admin' }
	});

console.log(`Acesso ao painel salvo para ${email}.`);
