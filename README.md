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
npm run db:migrate
npm run db:seed
npm run dev
```

O banco local é o arquivo `local.db`. Para recomeçar do zero, apague o arquivo e rode `db:migrate` e `db:seed` de novo.

## Scripts

| Comando               | O que faz                                         |
| --------------------- | ------------------------------------------------- |
| `npm run dev`         | Servidor de desenvolvimento                       |
| `npm run build`       | Build de produção                                 |
| `npm run check`       | Checagem de tipos (`svelte-check`)                |
| `npm run lint`        | Prettier + ESLint                                 |
| `npm run format`      | Formata o código                                  |
| `npm run db:generate` | Gera uma migration a partir de mudanças no schema |
| `npm run db:migrate`  | Aplica as migrations pendentes                    |
| `npm run db:seed`     | Popula um banco vazio com o catálogo de `seed/`   |
| `npm run db:studio`   | Abre o Drizzle Studio para inspecionar o banco    |

## Build de produção

```sh
npm run build
ORIGIN=http://localhost:3000 node --env-file=.env build
```

`ORIGIN` é o endereço público do site. O SvelteKit compara esse valor com a origem de cada formulário enviado (proteção contra CSRF); sem ele, adicionar produtos ao pedido e enviar o pedido respondem 403.
