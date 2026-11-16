import type { AdminUser } from '#lib/types.ts';

declare global {
	namespace App {
		interface Locals {
			// Preenchido só nas rotas do painel (ver hooks.server.ts).
			user: AdminUser | null;
		}
	}
}

export {};
