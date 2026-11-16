import { normalizeEmail } from './auth';
import { db } from './db';
import { users } from './db/schema';
import { hashPassword } from './password';

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 200;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type Registration = {
	name: string;
	email: string;
	password: string;
};

export type RegistrationErrors = Partial<Record<keyof Registration, string>>;

type RegistrationValidation =
	{ ok: true; registration: Registration } | { ok: false; errors: RegistrationErrors };

export function validateRegistration(input: Registration): RegistrationValidation {
	const name = input.name.trim();
	const email = normalizeEmail(input.email);

	const errors: RegistrationErrors = {};
	if (name.length < 2 || name.length > 80) errors.name = 'Informe seu nome (até 80 caracteres).';
	if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
		errors.email = 'Informe um e-mail válido, como nome@exemplo.com.';
	}
	if (input.password.length < MIN_PASSWORD_LENGTH || input.password.length > MAX_PASSWORD_LENGTH) {
		errors.password = `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
	}

	if (Object.keys(errors).length > 0) return { ok: false, errors };
	return { ok: true, registration: { name, email, password: input.password } };
}

// Devolve o id da conta criada, ou null se o e-mail já tiver cadastro.
export async function createCustomer(registration: Registration): Promise<number | null> {
	const [created] = await db
		.insert(users)
		.values({
			name: registration.name,
			email: registration.email,
			passwordHash: await hashPassword(registration.password),
			role: 'customer'
		})
		.onConflictDoNothing({ target: users.email })
		.returning({ id: users.id });

	return created?.id ?? null;
}
