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
| `npm run user:create` | Cria um acesso ao painel ou troca a senha de um   |

## Páginas da loja

| Rota                 | O que mostra                                                          |
| -------------------- | --------------------------------------------------------------------- |
| `/`                  | Compromissos da loja, novidades da vitrine, custos, passos e kits     |
| `/vitrine`           | Catálogo com busca e categorias                                       |
| `/vitrine/[slug]`    | Produto, com o total estimado de um pedido só com ele                 |
| `/carrinho`          | Itens, região de entrega, nota com fretes e taxa e envio do pedido    |
| `/como-funciona`     | Passo a passo, pagamento, tabela de frete EMS e avisos antes de pedir |
| `/endereco-no-japao` | Serviço de redirecionamento e lojas sugeridas                         |

## Conta da cliente

Para enviar um pedido a cliente cria uma conta (`/cadastro`) ou entra (`/entrar`). Em `/conta` ficam os dados dela e a lista "Meus pedidos". Cada pedido mostra o andamento com a data de cada passo e, depois da postagem, o código de rastreio com o link do correio do Japão.

Clientes e administração usam a mesma tabela de usuários, separados pelo papel (`customer` ou `admin`). Só o papel `admin` entra no painel.

## Painel administrativo

O painel fica em `/admin` e exige login de administração. Ele abre em "Hoje": a fila do atendimento (orçamentos a responder, pagamentos pendentes e pedidos para comprar e postar, com o tempo de espera do mais antigo), a lista de compras com os produtos dos pedidos pagos somados, os últimos pedidos e os números dos últimos 30 dias.

Na página de cada pedido o status avança um passo por vez, e marcar como enviado pede o código de rastreio do EMS. Voltar o status pela correção apaga as datas dos passos que vinham depois.

Os acessos são criados pelo terminal:

```sh
npm run user:create -- email@exemplo.com "Nome da pessoa"
```

O comando pede a senha (mínimo de 10 caracteres). Rodar de novo com o mesmo e-mail troca o nome e a senha; se o e-mail for de uma cliente, a conta dela passa a ter acesso ao painel.

## Build de produção

```sh
npm run build
ORIGIN=http://localhost:3000 node --env-file=.env build
```

`ORIGIN` é o endereço público do site. O SvelteKit compara esse valor com a origem de cada formulário enviado (proteção contra CSRF); sem ele, adicionar produtos ao pedido e enviar o pedido respondem 403.
