# Do Japão Para Você

Loja de encomendas do Japão: a cliente escolhe produtos japoneses e coreanos no catálogo, monta o pedido com frete e taxas calculados, e a loja compra no Japão e envia com rastreio.

Loja, backend e painel administrativo ficam no mesmo projeto SvelteKit.

> Projeto em desenvolvimento.

## Stack

- [SvelteKit](https://svelte.dev/docs/kit) + TypeScript
- [Drizzle ORM](https://orm.drizzle.team) com SQLite (libSQL)
- ESLint + Prettier

## Rodando localmente

Requer Node.js 24 ou mais novo.

```sh
npm install
cp .env.example .env
npm run dev
```

## Scripts

| Comando          | O que faz                          |
| ---------------- | ---------------------------------- |
| `npm run dev`    | Servidor de desenvolvimento        |
| `npm run build`  | Build de produção                  |
| `npm run check`  | Checagem de tipos (`svelte-check`) |
| `npm run lint`   | Prettier + ESLint                  |
| `npm run format` | Formata o código                   |
