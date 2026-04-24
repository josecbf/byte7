# Session Log

> Registro cronológico de sessões de trabalho. Formato resumido: data,
> objetivo da sessão, o que foi feito, o que ficou pendente.

---

## 2026-04-14 — Sessão 1 · Bootstrap do repositório

**Objetivo:** criar a demo do zero conforme briefing inicial.

**Feito:**

- Decisão de stack: Next.js 14 App Router + TS + Tailwind + Recharts +
  react-leaflet + React Hook Form/Zod.
- Estrutura de pastas `src/{app,components,services,mocks,types,lib,utils}`.
- Configs base: `package.json`, `tsconfig.json`, `tailwind.config.ts`,
  `next.config.mjs`, `postcss`, `.gitignore`, `.env.example`, ESLint.
- Docs: `project_context.md`, `session_log.md`, `decisions.md`, `todo.md`.
- Tipos, mocks e services para: auth, blog, investor.
- API routes mockadas: `/api/auth/*`, `/api/posts/*`, `/api/investor/*`.
- Middleware de auth (cookie `byte7_session`) protegendo `/admin` e
  `/investidor`.
- Componentes UI base (Button, Card, Input, Textarea, Badge, Container).
- Layouts: Navbar pública, Footer, AdminSidebar, InvestorSidebar.
- Site institucional: Home (hero + features + CTA), Sobre, Valores,
  Produtos, Blog público (lista + detalhe).
- Admin: login, listagem, criar, editar, excluir (status published/draft).
- Portal investidor: login, dashboard (KPIs, gráfico evolução mensal,
  aportes, mapa Leaflet das usinas, visualização e download do contrato).
- README com instruções de instalação, credenciais de demo e plano de
  evolução para produção.
- **Smoke test completo:** `npm run build` limpo (27 rotas), todas as
  rotas respondem, CRUD de posts via API funcionando, login de ambos os
  papéis ok, redirects do middleware corretos.

**Correções aplicadas durante smoke test:**

- Loop de redirect em `/admin/login` e `/investidor/login` → reestruturado
  com route groups `(protected)` para que o guard do layout não englobe a
  página de login (ver ADR-008).
- `500` ao passar ícones lucide (funções) de server layout para client
  `AppSidebar` → criados `AdminSidebar`/`InvestorSidebar` client wrappers
  que definem seus items internamente (ver ADR-009).
- Erro de prerender em `/admin/login` e `/investidor/login` por uso de
  `useSearchParams()` → cada login virou `page.tsx` server + `*LoginForm`
  client dentro de `<Suspense>` + `export const dynamic = "force-dynamic"`.

**Pendente / próximos passos:** ver `docs/todo.md`.

---

## 2026-04-14 — Sessão 2 · Comparativos e indicadores no dashboard

**Objetivo:** enriquecer o dashboard do investidor com comparativos de
performance e mais indicadores, **sem quebrar** a estrutura existente.

**Feito:**

- Novo utilitário `src/utils/finance.ts` com `buildSeries` (RateFn
  reutilizável por qualquer benchmark), `accumulatedReturn` (juros
  compostos) e `totalReturnRate`.
- Novo mock `src/mocks/benchmarks.ts` com taxas mensais constantes
  (CDI, Poupança, IPCA) e série mockada do Ibovespa (volátil, cíclica).
  Expondo também `BENCHMARK_LABELS` e `BENCHMARK_COLORS`.
- `src/mocks/investor.ts` refatorado para delegar ao `buildSeries`
  (sem alterar a API pública `buildMonthlyEvolution`) e ganhou
  `buildChartEvolution`, `buildComparative` e `computeByte7ReturnRate`.
- Novos types `ChartEvolutionPoint`, `ComparativeMonthRow`,
  `ComparativeAccumulated` em `src/types/investor.ts`.
- `EvolutionChart` agora aceita o novo shape e plota 4 séries:
  Byte7 (área), CDI e Ibovespa (linhas), Total investido (linha
  tracejada de referência). Cores vindas de `BENCHMARK_COLORS`.
- Novo componente `ComparativeTable` (server, apresentacional puro)
  com rendimento mensal por referência e linha final "Acumulado (%)".
- Dashboard (`/investidor`):
  - 5º KPI "Rentabilidade (%)" na linha do topo.
  - Grid passou a `sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5`.
  - Gráfico consome `buildChartEvolution` (3 curvas + referência).
  - Seção "Comparativo mensal" abaixo do gráfico com a tabela nova.
  - Card "Resumo" ganhou a linha "Rentabilidade".

**Decisões registradas:** ADR-010 (separação finance/benchmarks) e
ADR-011 (mocks determinísticos para Ibovespa).

**Pendente / próximos passos:** ver `docs/todo.md`.

---

## 2026-04-14 — Sessão 3 · Admin de investidores, textos corporativos, banner demo

**Objetivo:**
1. Admin com CRUD de cadastros de investidores (com 2 novos seed);
2. revisão de textos institucionais para tom mais corporativo;
3. aviso discreto "Versão demonstrativa" em todas as páginas.

**Feito:**

- Novo tipo `InvestorProfile` em `src/types/investorProfile.ts`.
- Novo store mockado em memória `src/mocks/investorProfiles.ts` com
  as mesmas 5 operações do padrão `mocks/posts.ts` (list, getById,
  create, update, delete). Seed com 3 cadastros:
  Marina Azevedo (existente), **Fernando Ribeiro** (novo, ativo) e
  **Carla Menezes** (nova, pendente).
- API routes admin-only em `src/app/api/investors[/id]/route.ts`
  (GET/POST/PUT/DELETE) com validação de role.
- Serviço `investorsAdminService` seguindo a mesma interface do
  `blogService` — swap para API real continua trivial.
- Páginas admin: `/admin/investidores` (lista + counters por status),
  `/admin/investidores/new` (criar) e `/admin/investidores/[id]/edit`
  (editar). Componentes novos: `InvestorForm`, `AdminInvestorsTable`,
  `InvestorStatusBadge`.
- Sidebar admin ganhou o item "Investidores". Visão geral `/admin`
  agora mostra blocos separados para Investidores e Blog.
- Novo componente `DemoBanner` montado no **root layout** → aparece
  em todas as páginas (site, admin, investidor, login, 404) com faixa
  discreta em ink-900 (ADR-012).
- Textos institucionais revisados para tom corporativo em Home, Sobre,
  Valores, Produtos e Footer. Estrutura preservada — apenas tom e
  vocabulário (ex.: "Área do investidor" → "Portal do investidor",
  "Admin do blog" → "Ambiente administrativo", etc).

**Decisões registradas:** ADR-012 (DemoBanner no root layout) e
ADR-013 (cadastro admin separado do usuário de login).

**Pendente / próximos passos:** ver `docs/todo.md`.

---

## 2026-04-14 — Sessão 4 · Dashboard admin consolidado por investidor

**Objetivo:** permitir ao admin consultar resultados consolidados da
base e, via dropdown, navegar para um investidor específico, sem
quebrar o portal do investidor existente.

**Feito:**

- `Aporte` passou a conter `investorId`. Os 5 aportes existentes foram
  atribuídos a Marina (`inv_001`). Adicionados 3 aportes novos para
  Fernando (`inv_002`, total R$ 105k). Carla (`inv_003`, "pendente")
  segue sem aportes — exercita o estado vazio. Total na base: 8
  aportes, R$ 235k.
- `MOCK_USERS` ganhou `investorProfileId` opcional. Marina
  (`usr_inv_1`) passou a referenciar `inv_001`.
- Novo `src/lib/currentInvestor.ts` com `getCurrentInvestorProfileId`
  e `getCurrentInvestorAportes`. Resolve a sessão → user → profile →
  filtro de aportes em um ponto único (ver ADR-014).
- Páginas do portal do investidor (`/investidor`, `/investidor/aportes`)
  e API routes (`/api/investor/dashboard`, `/api/investor/aportes`)
  agora filtram via `getCurrentInvestorAportes()` — nenhum aporte de
  outro investidor vaza para a sessão do investidor logado.
- Novo client component `InvestorSelector` que mantém a seleção em
  `?investor=<id>` via `useSearchParams` + `router.push`.
- Nova página `/admin/dashboard` (server component) com:
  - dropdown "Consolidado · todos os investidores" ou nome específico;
  - bloco de perfil quando um investidor é selecionado
    (nome, status, contato, nota interna);
  - KPIs (Investidores com posição, Total investido, Saldo,
    Rendimento acumulado, Rentabilidade);
  - gráfico de evolução (Byte7 × CDI × Ibovespa);
  - tabela comparativa mensal;
  - tabela de aportes e lista de usinas vinculadas;
  - empty state quando o investidor não tem aportes.
- Sidebar admin ganhou item "Resultados".
- `/admin` (visão geral) ganhou card "AUM consolidado" e botão
  "Resultados" direto.

**Decisões registradas:** ADR-014 (lib/currentInvestor como ponto
único de amarração sessão↔perfil).

**Pendente / próximos passos:** ver `docs/todo.md`.

---

## 2026-04-23 — Sessão 5 · Deploy público na Vercel

**Objetivo:** publicar a demo online para demonstração.

**Feito:**

- Projeto linkado à Vercel (escopo pessoal `jcbezerrafh-3914`, nome
  `byte7`) via `vercel --yes` a partir da raiz do repo.
- Build remoto concluído (27 rotas, Next.js 14.2.15, middleware
  edge de auth embarcado). Nenhuma env var foi definida — a demo
  roda 100% em mock (`NEXT_PUBLIC_DATA_SOURCE=mock` é o default do
  código, e o `.env.example` não tem segredos reais).
- Smoke test remoto: `/`, `/investidor/login` e `/admin/login`
  retornam 200.
- `.vercel/` gerado localmente e já coberto pelo `.gitignore`
  (linha 36).

**URLs públicas:**
- Produção (alias estável): https://byte7.vercel.app
- Deploy específico: https://byte7-k2vifpunu-jose-carlos-bezerra-filhos-projects.vercel.app
- Inspector: https://vercel.com/jose-carlos-bezerra-filhos-projects/byte7

**Observação importante:** a intenção era fazer um **preview
primeiro** e só depois promover. Porém, como era o primeiro deploy
do projeto, a Vercel CLI promoveu direto para produção (target
"production" no retorno da API, alias `byte7.vercel.app` criado).
A partir de agora, `vercel` sem flags gera preview; promoção requer
`vercel --prod` explicitamente (ver ADR-015).

**Decisões registradas:** ADR-015 (hosting na Vercel, conta pessoal
`jcbezerrafh-3914`).

**Pendente / próximos passos:** ver `docs/todo.md`.

---

## 2026-04-23 — Sessão 6 · Papel `editor` e área dedicada de edição do blog

**Objetivo:** separar a área administrativa da área de edição do blog.
Editor só mexe em posts; admin continua podendo tudo (incluindo posts).

**Feito:**

- Novo papel `"editor"` adicionado em `UserRole` (`src/types/auth.ts`).
- Helper `canEditBlog(session)` em `src/lib/session.ts` — retorna true
  para `admin` **ou** `editor`. Usado pelas route handlers de posts.
- Seed novo usuário `usr_editor_1` · `editor@byte7.com.br` · `editor123`
  em `src/mocks/users.ts`.
- Auth: nova route handler `POST /api/auth/editor` (espelho da admin) e
  método `authService.loginEditor` no client.
- Middleware: protege `/editor/**` exigindo `role === "editor"`, com
  `/editor/login` fora do guard (mesmo padrão de admin/investidor).
- APIs de posts (`/api/posts`, `/api/posts/[id]`, `/api/posts/by-slug`)
  trocaram `matchesRole(session, "admin")` por `canEditBlog(session)` —
  admin continua funcionando e editor passa a poder CRUD completo.
  APIs de investidores permanecem admin-only.
- CRUD de posts extraído para componentes compartilhados com prop
  `basePath: string`:
  - `src/components/blog/PostsTable.tsx` (antes `AdminPostsTable`)
  - `src/components/blog/NewPostClient.tsx` (novo)
  - `src/components/blog/EditPostClient.tsx` (antes em `admin/posts/[id]/edit/`)
- Admin posts pages reescritas para consumir os compartilhados com
  `basePath="/admin"`. Arquivos antigos removidos
  (`app/admin/(protected)/posts/AdminPostsTable.tsx` e
  `.../[id]/edit/EditPostClient.tsx`).
- Nova área do editor em `src/app/editor/`:
  - `login/` → `page.tsx` (server + Suspense) + `EditorLoginForm` (client)
  - `(protected)/layout.tsx` (guard `role=editor` + EditorSidebar)
  - `(protected)/page.tsx` → visão geral (stats de blog)
  - `(protected)/posts/page.tsx`, `.../new/page.tsx`, `.../[id]/edit/page.tsx`
    (todas usam componentes compartilhados com `basePath="/editor"`).
- Novo componente `src/components/layout/EditorSidebar.tsx` (segue
  ADR-009: client wrapper com items próprios).

**Smoke test local (`npm run start` na porta 3000):**

- `/editor/login` 200; `/editor` sem cookie → 307 para `/editor/login`.
- POST `/api/auth/editor` com senha errada → 401; com senha certa → 200
  e cookie `byte7_session` emitido.
- Com cookie de editor: `/editor`, `/editor/posts`, `/editor/posts/new` → 200.
- Com cookie de editor: `/admin` e `/admin/investidores` → 307 para
  `/admin/login` (isolamento confirmado).
- Com cookie de editor: `POST /api/posts` criou, `PUT` atualizou, `DELETE` (204).
- **Regressão:** admin continua entrando em `/admin/*` (posts e investidores
  OK), investidor continua entrando em `/investidor` OK, admin **não**
  acessa `/editor/*` (redireciona para `/editor/login`) — isso é intencional,
  admin já tem `/admin/posts`.

**Decisões registradas:** ADR-016 (papel `editor` e área dedicada com
componentes de blog parametrizados por `basePath`).

**Pendente / próximos passos:** ver `docs/todo.md`.

---

## 2026-04-23 — Sessão 7 · Fundamento financeiro operacional (Statements + Aportes CRUD + Auditoria)

**Objetivo:** habilitar o admin a alimentar os dados financeiros que o
investidor enxerga no portal (aportes + lançamentos mensais de
rentabilidade/posição) com trilha de auditoria por mutação.

**Feito:**

**Modelos + stores**
- Novo tipo `MonthlyStatement` em `src/types/statement.ts` com shape
  `{investorId, month, invested, rate, balance, note?, metadados de criação}`.
- Novo tipo `AuditLogEntry` em `src/types/audit.ts` com `{actor, action,
  entity, investorId, before, after, source, timestamp}`.
- Store em memória `src/mocks/statements.ts` com CRUD e unicidade por
  `(investorId, month)` (cria outro lançamento para o mesmo mês → 409).
- Store append-only `src/mocks/auditLog.ts` (apenas `appendAudit` e
  `listAudit` — nunca update/delete).
- Aportes extraídos para `src/mocks/aportes.ts` (seguindo o mesmo
  padrão de `mocks/posts.ts`). `MOCK_APORTES` deixou de ser exportado;
  consumidores passaram a usar `listAportes()`.
- Helper `src/lib/audit.ts` (`recordAudit({session, action, entity,
  entityId, investorId, before, after})`) resolve ator pela sessão e
  delega ao `appendAudit`.

**Integração com dashboard (ADR-017)**
- `buildMonthlyEvolution(aportes, statements, rate)` agora: baseline
  via `buildSeries` (aportes + 6% a.m.); para cada mês com statement,
  sobrescreve `invested/balance/yieldAmount` com os valores
  registrados. Demais meses seguem no fallback.
- `buildDashboardSummary`, `buildChartEvolution`, `buildComparative`
  e `computeByte7ReturnRate` agora aceitam `statements[]`.
- Investor dashboard (`/api/investor/dashboard`) passou a ler statements
  via `getCurrentInvestorStatements` (novo em `lib/currentInvestor.ts`).
- Admin dashboard (`/admin/dashboard`) passa `listStatements()` (ou
  filtrado por investidor) nas funções.

**API admin-only (ADR-018)**
- `/api/investors/[id]/aportes` (GET + POST)
- `/api/investors/[id]/aportes/[aporteId]` (PUT + DELETE)
- `/api/investors/[id]/statements` (GET + POST com 409 em mês duplicado)
- `/api/investors/[id]/statements/[statementId]` (PUT + DELETE)
- `/api/audit` (GET com filtros: `investorId`, `actorId`, `entity`,
  `source`, `from`, `to`)
- PUT/DELETE de `/api/investors/[id]` passaram a também registrar
  auditoria (entidade `investor_profile`).

**UI admin**
- Nova página `src/app/admin/(protected)/investidores/[id]/financeiro/`
  com duas seções inline: `AportesSection` e `StatementsSection`. Cada
  uma tem formulário (create/edit) + tabela + actions (editar/excluir).
- Botão "Financeiro" agora aparece em cada linha de
  `/admin/investidores` e no topo da tela `/admin/investidores/[id]/edit`.
- Nova página `src/app/admin/(protected)/auditoria/` com filtros
  (investidor, entidade, origem, ator, período) e tabela com rows
  expansíveis que mostram JSON `before/after` formatado.
- Sidebar admin ganhou o item "Auditoria" (ícone ClipboardList).

**Smoke test (porta 3000):**
- Aportes CRUD por admin: lista 5, cria → 6, atualiza → 200, exclui
  → 204, volta a 5.
- Statements: cria 1 para Marina/mar-2026, tenta duplicar → 409,
  atualiza → 200, listagem com 1 entrada.
- Dashboard do investidor: mar/2026 retorna `invested=125000,
  balance=145000` (os valores registrados pelo statement).
- Auditoria: 5 entradas (3 aportes + 2 statements) com `actorName`,
  `investorId` correto, filtros por `entity` e `investorId` funcionando.
- Autorização: editor e não-autenticado recebem 401 em `/api/investors/*`
  e `/api/audit`.

**Decisões registradas:** ADR-017 (MonthlyStatement sobrescreve cálculo
quando presente), ADR-018 (log append-only + helper único).

**Pendente / próximos passos (ver `docs/todo.md`):**
- Sessão 8 — criar login de investidor e reset de senha (admin).
- Sessão 9 — export/import Excel das informações financeiras usando
  SheetJS (`xlsx`), com `source: "excel_upload"` na auditoria.

---

## 2026-04-23 — Sessão 7b · Append-only em aportes e statements (ADR-019)

**Objetivo:** garantir que nenhuma edição ou exclusão de aporte/
statement remova a informação anterior do banco. Admin precisa ver a
trilha completa na auditoria, mas o investidor só enxerga o registro
ativo mais recente.

**Feito:**

- Campos novos em `Aporte` e `MonthlyStatement`: `supersededBy`,
  `supersededAt`, `voidedAt`, `voidedBy`. `updatedAt/By` removidos do
  `MonthlyStatement` — não existe update.
- `mocks/statements.ts` reescrito:
  - `createStatement` auto-supersede: se já houver um ativo para
    `(investorId, month)`, o antigo é marcado com `supersededBy =
    new.id` e o novo entra ativo.
  - `voidStatement` substitui o antigo `deleteStatement` — faz
    soft-delete via `voidedAt/voidedBy`.
  - Sem `updateStatement`.
- `mocks/aportes.ts` no mesmo padrão:
  - `createAporte` aceita `supersedes: id` opcional (explícito, pois
    aportes não têm chave natural de duplicata).
  - `voidAporte` substitui `deleteAporte`.
- `listAportes` e `listStatements` passaram a filtrar por `active`
  por padrão. `includeInactive: true` devolve o histórico completo
  (usado só pela tela admin `/financeiro`).
- API routes:
  - PUT removido em `/api/investors/[id]/aportes/[aporteId]` e
    `/api/investors/[id]/statements/[statementId]`.
  - POST em ambas gera auditoria dupla quando houver supersede:
    `update` do antigo (com `note: "Substituído por X"`) + `create`
    do novo (com `note: "Substitui Y"`).
  - DELETE agora chama void, gera `action=delete` com
    `note: "Invalidado (soft-delete)"` — intenção do admin
    preservada, row continua no banco.
- UI admin `/financeiro`:
  - Tabelas agora mostram TODAS as linhas (ativas + superseded +
    voided) com badge de status por linha. Linhas inativas aparecem
    em cinza, valores com `line-through`.
  - Botões "Editar" viraram "Corrigir" — submetem POST com
    `supersedes: id_antigo`. "Excluir" virou "Invalidar".
  - Ações só aparecem em linhas ativas.
  - Header reflete contagem de ATIVOS e aviso "histórico preservado".

**Smoke test local:**
- Statements: cria #1 (errado), cria #2 mesmo mês (correção) → #1
  marcado `supersededBy=#2`; investidor vê só #2.
- DELETE do #2 ativo → 204 e `voidedAt/voidedBy` preenchidos.
  Segunda tentativa → 409 (idempotente).
- Aportes: POST com `supersedes: apt_001` → novo ativo, apt_001
  marcado superseded. Supersede de aporte já inativo → 409.
- Investidor: dashboard mostra exatamente 5 aportes ativos, apt_001
  não aparece mais, total investido sobe de 130k → 135k refletindo
  a correção de 25k → 30k.
- Auditoria: 6 entradas cobrindo create original, update com
  `Substituído por`, create com `Substitui`, delete com
  `Invalidado (soft-delete)`.

**Decisões registradas:** ADR-019 (append-only em aportes e
statements).

**Pendente:** sem mudanças nos próximos passos (8 e 9 seguem).

---

## 2026-04-23 — Sessão 8 · Criar acesso do investidor + reset de senha

**Objetivo:** permitir que o admin crie o usuário de login do portal
para um cadastro de investidor que ainda não tem acesso, e redefina
senha de quem já tem. Toda operação fica em auditoria — sem vazar
a senha no log.

**Feito:**

- Nova entidade de auditoria `user_login` em `src/types/audit.ts`
  (adicionada também em `/api/audit`, `/admin/auditoria/page.tsx` e
  `AuditClient.tsx` como filtro e label "Acesso").
- `src/mocks/users.ts` ganhou CRUD lean:
  - `MOCK_USERS` agora é inicializado a partir de `SEED_USERS`
    (padrão append-ready).
  - `findUserByEmail`, `getUserById`, `getUserByInvestorProfileId`,
    `toPublicUser` (sem `password`), `createInvestorUser`,
    `resetPassword` (mínimo 6 caracteres).
  - Validações: e-mail duplicado → throw; investor já com login → throw.
- APIs admin-only:
  - `GET /api/investors/[id]/login` → retorna o usuário (sem senha)
    ou `null` quando não existe.
  - `POST /api/investors/[id]/login` → cria acesso; nome/e-mail
    default do profile; 409 para regras de unicidade/senha curta.
  - `PUT /api/investors/[id]/login/password` → redefine senha; 404 se
    o investidor não tem acesso.
- Auditoria:
  - Criação → `entity=user_login`, `action=create`, `after` é o
    usuário sanitizado (sem `password`), `note: "Acesso criado"`.
  - Reset → `entity=user_login`, `action=update`, `before/after`
    ambos `null` (nunca o valor da senha), `note: "Senha redefinida"`.
- UI `/admin/investidores/[id]/edit`:
  - Novo card `LoginSection` abaixo do cadastro.
  - Sem acesso → form `CreateLoginCard` com nome/e-mail pré-
    preenchidos do cadastro + senha.
  - Com acesso → `ResetPasswordCard` mostrando o usuário atual
    (nome + e-mail + id) e o campo "Nova senha".

**Smoke test local:**
- Fernando (inv_002) sem login: GET `/login` → `null`. POST senha
  curta → 409. POST válido → 201 + payload sem `password`. POST
  duplicado → 409.
- Fernando faz login no portal: senha errada → 401, correta → 200,
  dashboard mostra os 3 aportes (R$ 105k).
- Reset: senha curta → 400, válida → 200. Login com senha antiga →
  401, com a nova → 200.
- Reset em Carla (sem login) → 404.
- Auditoria: 2 entradas `user_login` (create + update); varredura
  no JSON confirma que a senha nunca aparece no log.
- Autorização: POST sem auth → 401; editor → 401.
- Páginas `/admin/investidores/inv_002/edit` e `inv_003/edit` → 200.

**Decisões registradas:** ADR-020 (acesso de investidor criado pelo
admin, senha nunca persistida em auditoria).

**Pendente:** Sessão 9 — export/import Excel (xlsx) com linha por
`(investor, mês)` e `source: "excel_upload"` na auditoria.

---

## 2026-04-23 — Sessão 9 · Export e import Excel dos lançamentos mensais

**Objetivo:** permitir que o admin baixe um .xlsx com todos os
lançamentos ativos (linha = `investor × mês`), corrija/adicione
linhas, reenvie e veja o diff aplicado. Cada mudança fica em
auditoria com origem `excel_upload`.

**Decisão de biblioteca:** trocamos `xlsx` (SheetJS) por `exceljs`.
`xlsx` do npm tem 2 advisories **sem fix disponível** (Prototype
Pollution + ReDoS). `exceljs` é ativamente mantido; a única
vulnerabilidade indireta (moderate, via `uuid`) não nos afeta.

**Feito:**

- Nova lib `src/lib/statementsExcel.ts`:
  - `buildStatementsWorkbook(statements, investors)` → Buffer .xlsx
    com colunas `ID Investidor | Investidor | Mês | Investido | Taxa (%)
    | Saldo | Observação`. Taxa sai como percentual (0.06 → 6).
  - `parseStatementsWorkbook(buf)` → `{rows, errors}`. Valida formato
    do mês (`YYYY-MM`), tipos numéricos, e detecta duplicatas dentro
    do próprio arquivo.
- Novas rotas admin-only:
  - `GET /api/admin/statements/export` — devolve o .xlsx com
    Content-Disposition anexo.
  - `POST /api/admin/statements/import` — aceita multipart, parseia,
    aplica linha a linha, devolve `ImportSummary`.
- Apuração por linha na importação:
  - investor inexistente → `error`.
  - linha sem ativo correspondente → `created`.
  - linha igual ao ativo → `unchanged` (tolerância de 0,005 para BRL
    e 1e-6 para taxa).
  - linha diferente do ativo → `superseded` (via `createStatement`,
    que marca o antigo com `supersededBy` do novo — ADR-019).
- Auditoria gera `source: "excel_upload"` com note explicando a
  origem (`Substituído por X (linha Excel N)`, etc).
- Nova página `/admin/importacao` (server) + `ImportClient` (client)
  com dois cards (Exportar / Importar), upload de arquivo,
  resumo com contadores e tabela linha a linha dos outcomes.
  Link direto para `/admin/auditoria?source=excel_upload`.
- Sidebar admin ganhou "Importação Excel".

**Smoke test local:**
- Export com 2 statements ativos → 200, content-type xlsx, 6903
  bytes, arquivo válido (zip com 16 entries).
- Round-trip do próprio export → `total=2 created=0 superseded=0
  unchanged=2 errors=0`.
- Arquivo com 4 linhas (1 supersede, 1 new, 1 investor inexistente,
  1 mês inválido):
  - `L2 superseded` (ids novos e antigos retornados).
  - `L3 created`.
  - `L4 error` "Investidor não encontrado".
  - `L5 parse error` "Mês inválido".
- `GET /api/audit?source=excel_upload` → 3 entradas (create, update
  do superseded, create com "Substitui X (linha Excel 2)").
- Autorização: sem auth → 401, editor → 401.
- Páginas `/admin/importacao` e `/admin/auditoria?source=excel_upload`
  → 200.

**Decisões registradas:** ADR-021 (Excel round-trip com semântica
idempotente e `source: "excel_upload"` na auditoria).

**Pendente:** (nada do escopo da requisição original). Backlog curto
da `todo.md` segue.
