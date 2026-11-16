import type { SessionUser } from '#lib/types.ts';

declare global {
	namespace App {
		interface Locals {
			// Quem está logado, ou null. Preenchido a cada requisição em hooks.server.ts.
			user: SessionUser | null;
		}
	}
}

export {};
