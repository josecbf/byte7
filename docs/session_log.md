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
