import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

const SALT_BYTES = 16;
const KEY_BYTES = 64;

function deriveKey(password: string, salt: Buffer, keyBytes: number): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		scrypt(password, salt, keyBytes, (error, key) => (error ? reject(error) : resolve(key)));
	});
}

// O resultado guarda o sal junto com a chave ("sal:chave", em hexadecimal), então
// basta essa string para conferir a senha depois.
export async function hashPassword(password: string): Promise<string> {
	const salt = randomBytes(SALT_BYTES);
	const key = await deriveKey(password, salt, KEY_BYTES);
	return `${salt.toString('hex')}:${key.toString('hex')}`;
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
	const [saltHex, keyHex] = passwordHash.split(':');
	const expectedKey = Buffer.from(keyHex, 'hex');
	const key = await deriveKey(password, Buffer.from(saltHex, 'hex'), expectedKey.length);
	return timingSafeEqual(key, expectedKey);
}
