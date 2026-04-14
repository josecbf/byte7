# Byte7 Demo

> Demo mockada da plataforma **Byte7** — site institucional + portal do
> investidor para uma empresa de intermediação de tokenização de energia.
>
> **Versão**: Demo · **Estado**: funcional, apenas para consulta · **Dados**: mockados localmente.

## Sobre esta versão

Esta é a versão **Demo** da Byte7. O objetivo é demonstrar a experiência
do produto de ponta a ponta — site institucional, blog com área
administrativa e portal do investidor — sem backend financeiro real.

⚠️ **Importante**

- Todos os dados (investidor, aportes, usinas, contrato, posts) são
  **mockados** localmente.
- A área do investidor é **apenas de consulta**. Não há depósitos,
  saques, transferências ou qualquer movimentação financeira.
- O rendimento exibido de **6% ao mês** é um parâmetro desta demo, não
  uma promessa financeira.
- A identidade visual é **provisória**. A identidade oficial será
  aplicada em versão futura.

## Stack

- **Next.js 14 (App Router)** + **TypeScript** + **Tailwind CSS**
- **Recharts** para gráficos
- **react-leaflet** + OpenStreetMap para o mapa das usinas
- **React Hook Form** + **Zod** para formulários e validação
- **lucide-react** para ícones · **date-fns** para datas

## Requisitos

- Node.js ≥ 18.17 (recomendado 20+)
- npm 9+ (ou pnpm/yarn equivalentes)

## Instalação e execução

```bash
# 1. instalar dependências
npm install

# 2. copiar variáveis de ambiente de exemplo
cp .env.example .env.local

# 3. rodar em desenvolvimento
npm run dev
```

Acesse <http://localhost:3000>.

### Scripts

| Script              | Descrição                               |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Servidor de desenvolvimento (hot reload) |
| `npm run build`     | Build de produção                        |
| `npm start`         | Servir o build de produção               |
| `npm run lint`      | ESLint                                   |
| `npm run typecheck` | Verificação de tipos (TS, sem emit)      |

## Credenciais de demonstração

| Perfil      | E-mail                     | Senha            |
| ----------- | -------------------------- | ---------------- |
| Investidor  | `investidor@byte7.com.br`  | `investidor123`  |
| Admin blog  | `admin@byte7.com.br`       | `admin123`       |

Os formulários de login vêm pré-preenchidos com as credenciais da demo.

## Áreas da aplicação

### 1. Site institucional

- `/` — Home (hero, features, CTA)
- `/sobre` — Sobre nós
- `/valores` — Missão, visão, compromisso e princípios
- `/produtos` — Produtos e serviços
- `/blog` — Lista de posts publicados
- `/blog/[slug]` — Post individual

### 2. Admin do blog — `/admin`

- `/admin/login` — Autenticação (cookie de sessão mockado)
- `/admin` — Visão geral (contagens e atalhos)
- `/admin/posts` — Listar posts (com editar/excluir)
- `/admin/posts/new` — Criar post
- `/admin/posts/[id]/edit` — Editar post

Status suportados: **publicado** e **rascunho**. Apenas posts
publicados aparecem no blog público.

### 3. Portal do investidor — `/investidor`

- `/investidor/login` — Autenticação
- `/investidor` — Dashboard com KPIs, gráfico de evolução mensal,
  aportes, mapa das usinas e resumo
- `/investidor/aportes` — Histórico completo de aportes
- `/investidor/usinas` — Mapa + lista das usinas vinculadas
- `/investidor/contrato` — Visualização e download do contrato (txt)

Todas as telas do portal são **apenas leitura**.

## Estrutura de pastas

```
byte7/
├── docs/                         # memória operacional do projeto
│   ├── project_context.md
│   ├── session_log.md
│   ├── decisions.md
│   └── todo.md
├── public/                       # assets estáticos
├── src/
│   ├── app/
│   │   ├── (site)/              # site institucional (navbar pública)
│   │   │   ├── page.tsx         # /
│   │   │   ├── sobre/
│   │   │   ├── valores/
│   │   │   ├── produtos/
│   │   │   └── blog/
│   │   ├── admin/               # área admin do blog
│   │   │   ├── login/
│   │   │   ├── posts/
│   │   │   └── layout.tsx
│   │   ├── investidor/          # portal do investidor
│   │   │   ├── login/
│   │   │   ├── aportes/
│   │   │   ├── usinas/
│   │   │   ├── contrato/
│   │   │   └── layout.tsx
│   │   ├── api/                 # route handlers — backend mockado
│   │   │   ├── auth/
│   │   │   ├── posts/
│   │   │   └── investor/
│   │   ├── layout.tsx           # root layout
│   │   ├── globals.css
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/                  # primitivos (Button, Card, Input...)
│   │   ├── layout/              # Navbar, Footer, Sidebar, Topbar
│   │   ├── investor/            # KpiCard, EvolutionChart, UsinasMap...
│   │   ├── blog/                # PostCard, PostForm
│   │   └── (admin/)             # componentes específicos do admin
│   ├── services/                # API pública da camada de dados
│   │   ├── api-client.ts
│   │   ├── auth.service.ts
│   │   ├── blog.service.ts
│   │   └── investor.service.ts
│   ├── mocks/                   # fonte de dados na demo
│   │   ├── users.ts
│   │   ├── posts.ts
│   │   ├── usinas.ts
│   │   └── investor.ts
│   ├── types/                   # contratos TypeScript compartilhados
│   │   ├── auth.ts
│   │   ├── blog.ts
│   │   └── investor.ts
│   ├── lib/                     # session, format, env
│   ├── utils/                   # helpers puros (cn, slugify)
│   └── middleware.ts            # auth guard das rotas protegidas
├── .env.example
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Arquitetura de dados

A UI **nunca** fala diretamente com os mocks — ela consome apenas os
**services** (`src/services/*`), que por sua vez chamam as **route
handlers** internas (`src/app/api/*`). Essas route handlers leem os
**mocks** (`src/mocks/*`).

```
  UI ──► services ──► /api/* (route handler) ──► mocks
                      └── no futuro: API real
```

### Migrando para uma API real

1. Construir um backend que exponha o mesmo contrato das route handlers
   atuais (ver `src/app/api/**` e os `*.service.ts`).
2. No `.env.local` (ou `.env.production`) setar:
   ```
   NEXT_PUBLIC_DATA_SOURCE=api
   NEXT_PUBLIC_API_BASE_URL=https://api.byte7.com.br
   ```
3. (Opcional) Remover `src/app/api/*` e `src/mocks/*`.

Nenhuma página ou componente precisa ser alterado — os services já
respeitam `NEXT_PUBLIC_API_BASE_URL` através de `apiRequest`.

## Autenticação (mock)

Sessão é um cookie HTTP-only `byte7_session` contendo JSON base64
(`{ userId, role, name }`). O `src/middleware.ts` protege:

- `/admin/**` → exige `role === "admin"`
- `/investidor/**` → exige `role === "investor"`

Em produção, substituir pela solução de preferência (NextAuth, Clerk,
backend próprio). O formato do payload pode ser preservado, o que
mantém o middleware e o `matchesRole` estáveis.

## Persistência de posts

Em modo demo, os posts ficam em memória do servidor Next.js (módulo
`src/mocks/posts.ts`). Em dev, as alterações persistem entre requests,
mas são zeradas a cada restart — comportamento esperado para
demonstração.

## Evolução para produção

Próximos passos estão documentados em [`docs/todo.md`](docs/todo.md). Em
linhas gerais:

1. **Backend real** + `NEXT_PUBLIC_DATA_SOURCE=api`.
2. **Auth real** (NextAuth/Clerk/backend próprio).
3. **Banco** para posts + upload de imagens (S3/Cloudinary).
4. **Observabilidade** (Sentry + métricas Vercel).
5. **Aplicar identidade visual oficial** quando disponível.

## Contexto do projeto

Toda decisão relevante, histórico de sessões e pendências é mantido em
[`docs/`](docs/):

- [`docs/project_context.md`](docs/project_context.md) — visão geral e
  restrições do projeto.
- [`docs/session_log.md`](docs/session_log.md) — o que foi feito em
  cada sessão.
- [`docs/decisions.md`](docs/decisions.md) — decisões arquiteturais
  (ADRs).
- [`docs/todo.md`](docs/todo.md) — backlog e próximos passos.

Essa documentação serve como **memória operacional** do projeto: se
uma nova sessão começar do zero, a leitura dos quatro arquivos acima é
suficiente para retomar o trabalho.
