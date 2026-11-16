// Campo de texto de um formulário. Campo ausente ou arquivo enviado no lugar vira texto vazio.
export function textField(data: FormData, name: string): string {
	const value = data.get(name);
	return typeof value === 'string' ? value : '';
}
