import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { building } from '$app/env';
import { DATABASE_URL } from '$app/env/private';
import * as schema from './schema';

function connect(): LibSQLDatabase<typeof schema> {
	if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');
	return drizzle(createClient({ url: DATABASE_URL }), { schema, casing: 'snake_case' });
}

// No build, o SvelteKit importa as rotas numa worker thread só para analisá-las.
// Abrir o SQLite nativo ali derruba o processo ao final, então nesse momento não há conexão.
export const db: LibSQLDatabase<typeof schema> = building
	? drizzle.mock({ schema, casing: 'snake_case' })
	: connect();
