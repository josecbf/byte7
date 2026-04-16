# Decisões Arquiteturais

> Log de decisões (ADR-lite). Cada decisão: **contexto → decisão →
> consequências**. Escrever aqui sempre que uma escolha não-óbvia for
> tomada.

---

## ADR-001 — Next.js App Router como base

**Contexto:** precisamos de uma stack moderna, madura e fácil de
evoluir. A demo já combina site público, área admin e portal autenticado
de investidor — o que se beneficia de roteamento file-based com grupos
de rota e layouts aninhados.

**Decisão:** Next.js 14 com App Router, TypeScript e Tailwind.

**Consequências:**
- Rotas organizadas por domínio (`(site)`, `admin`, `investidor`).
- Route handlers nativos (`app/api/*`) atendem como backend mockado e
  podem ser removidos no dia do swap para API real.
- Middleware global cobre autenticação.

---

## ADR-002 — Camada `services` abstrai origem dos dados

**Contexto:** precisamos permitir trocar mocks por uma API real com
mínimo retrabalho.

**Decisão:** toda leitura/escrita da UI passa por `src/services/*`. Os
services consultam `NEXT_PUBLIC_DATA_SOURCE`:
- `mock` (padrão) → devolvem dados dos `src/mocks/*` (direto ou via
  fetch para as route handlers internas).
- `api` (futuro) → delegam para `NEXT_PUBLIC_API_BASE_URL` via um
  cliente HTTP único (`services/api-client.ts`).

**Consequências:**
- UI não sabe se os dados vêm de mock ou API.
- Migrar para backend real = trocar env var + (opcional) deletar
  `app/api/*` e `mocks/*`.

---

## ADR-003 — Auth mockada via cookie `byte7_session`

**Contexto:** precisamos de duas áreas protegidas (admin, investidor)
sem criar infra real de auth.

**Decisão:** cookie HTTP-only `byte7_session` com JSON base64
`{ userId, role, name }`. Emitido por `POST /api/auth/{investor|admin}`
após match com `src/mocks/users.ts`. Validado pelo middleware.

**Consequências:**
- Zero infra: nada de JWT, OAuth, banco.
- No swap para produção, basta trocar o emissor e o validador do cookie
  — o contorno de rotas e o formato do payload são estáveis.

---

## ADR-004 — Persistência de posts em memória do servidor

**Contexto:** o CRUD de posts precisa funcionar "de verdade" na demo,
mas sem banco de dados.

**Decisão:** `src/mocks/posts.ts` expõe um array mutável em memória
acessado pelas route handlers `/api/posts/*`. Seed inicial vem do próprio
arquivo. Em desenvolvimento, alterações sobrevivem enquanto o processo
Next.js estiver vivo (módulo é cacheado).

**Consequências:**
- O admin consegue criar/editar/excluir posts e vê-los refletidos no
  blog público imediatamente.
- Restart do servidor zera as alterações (aceitável para demo).
- Migrar para BD real = implementar os mesmos 5 métodos do módulo em
  cima do driver do banco.

---

## ADR-005 — Identidade visual provisória

**Contexto:** o briefing explicita que a identidade oficial virá
depois. Não faz sentido investir tempo em branding.

**Decisão:** paleta verde (energia) + slate (profissional), tipografia
Inter via fonte do sistema, componentes UI primitivos próprios em
Tailwind, sem shadcn/Radix.

**Consequências:**
- Quando a identidade chegar, basta ajustar `tailwind.config.ts` e os
  primitivos em `components/ui/*`.

---

## ADR-006 — Mapa com Leaflet + OpenStreetMap

**Contexto:** precisamos de mapa com marcadores de usinas.

**Decisão:** `react-leaflet` + tiles do OpenStreetMap (sem chave de
API). Componente do mapa é carregado via `dynamic(..., { ssr: false })`
porque Leaflet depende de `window`.

**Consequências:**
- Funciona offline após primeiro load (tiles em cache do browser).
- Sem custo nem onboarding de Mapbox/Google Maps.
- Troca futura para outro provedor é localizada em um componente.

---

## ADR-007 — Rendimento fixo de 6% ao mês exibido como parâmetro

**Contexto:** o briefing pede "rendimento exibido como 6% ao mês".

**Decisão:** os mocks geram a evolução mensal aplicando exatamente
6% a.m. sobre o saldo consolidado. O número aparece no dashboard como
"Rendimento contratado" — nunca como promessa ou projeção.

**Consequências:**
- Todos os cards de KPI batem matematicamente entre si
  (`total investido` + juros compostos a 6% a.m. = `saldo consolidado`).

---

## ADR-008 — Route groups `(protected)` para áreas autenticadas

**Contexto:** no primeiro desenho, `src/app/admin/layout.tsx` aplicava o
guard de autenticação. Como `src/app/admin/login/` fica dentro de
`src/app/admin/`, o layout também envolvia a própria página de login, o
que criava um loop de redirect quando o usuário não estava autenticado.

**Decisão:** mover as rotas autenticadas para route groups
`(protected)` — `src/app/admin/(protected)/…` e
`src/app/investidor/(protected)/…`. O layout com o guard vive dentro do
route group; a página de login fica fora dele, sem layout protegido. O
nome do grupo não aparece na URL.

**Consequências:**
- `/admin/login` e `/investidor/login` são renderizados sem o layout
  com sidebar — o que também é melhor visualmente.
- Qualquer nova rota autenticada precisa ser criada dentro do group
  `(protected)`; rotas públicas dentro de `/admin` ou `/investidor`
  ficam fora.

---

## ADR-009 — Sidebars de admin/investor como client wrappers

**Contexto:** layouts (server components) não podem passar funções para
client components — os ícones do `lucide-react` são funções, logo
`<AppSidebar items={[{ icon: LayoutDashboard, ... }]} />` falha com
"Functions cannot be passed directly to Client Components".

**Decisão:** `AppSidebar` permanece um client component genérico de
apresentação. Para cada área protegida, existe um wrapper também client
(`AdminSidebar`, `InvestorSidebar`) que define os items com os ícones
localmente e chama `<AppSidebar items={…} />`. Os layouts server apenas
renderizam o wrapper passando `userName`.

**Consequências:**
- Ícones vivem no client, onde podem ser serializados pela árvore React.
- Adicionar um item ao menu = editar o wrapper (arquivo pequeno, local).

---

## ADR-010 — Separação finance (cálculo) × benchmarks (dados)

**Contexto:** ao adicionar comparativos ao dashboard (CDI, Poupança,
IPCA, Ibovespa), precisávamos de dois tipos de coisa bem diferentes:
(a) funções puras de cálculo, reutilizáveis; (b) dados mockados com
taxas realistas.

**Decisão:** duas caixas separadas.
- `src/utils/finance.ts` — lógica pura: `buildSeries(aportes, rateFn)`,
  `accumulatedReturn(rates[])`, `totalReturnRate(invested, balance)`.
  Não conhece mocks, não conhece benchmarks específicos.
- `src/mocks/benchmarks.ts` — dados: taxas mensais por benchmark,
  série mockada do Ibovespa, labels e cores. Nenhum cálculo.
- `src/mocks/investor.ts` — orquestra os dois: compõe `rateFn` a partir
  de `getMonthlyRate(key, i)` e chama `buildSeries` para montar as
  séries consumidas pelo dashboard.

**Consequências:**
- Testes unitários de cálculo passam a ser triviais (sem mock).
- Adicionar um novo benchmark = editar só `benchmarks.ts` + uma linha
  em `buildChartEvolution` / `buildComparative`.
- `buildMonthlyEvolution` (API antiga) foi preservada: agora é um
  wrapper fino sobre `buildSeries` com rate constante. Nada quebra
  nas telas que já a consumiam.

---

## ADR-011 — Ibovespa mockado com série cíclica determinística

**Contexto:** CDI, Poupança e IPCA são taxas "comportadas" e podem ser
aproximadas por valores mensais constantes. Ibovespa é volátil — se
usássemos constante, o gráfico ficaria uma reta equivalente a um
benchmark calmo, descaracterizando a comparação.

**Decisão:** `IBOV_MONTHLY_RATES` é um array com 18 meses de variações
entre ~-4% e ~+5%, misturando positivos e negativos. Quando a janela
de análise for mais longa que o array, ciclamos via módulo
(`i % array.length`). Valores foram escolhidos à mão para parecerem
realistas; não são uma série histórica real.

**Consequências:**
- A curva do Ibovespa no gráfico oscila de verdade, o que dá mais
  credibilidade ao comparativo.
- Determinístico: a tabela e o gráfico sempre batem entre si e sempre
  renderizam a mesma coisa para o mesmo intervalo de aportes.
- Trocar por série real = trocar apenas o array (ou apontar para uma
  API), sem mexer em `getMonthlyRate` nem em quem consome.

---

## ADR-012 — Banner demonstrativo global via root layout

**Contexto:** precisávamos de um aviso discreto, mas universal, de
que a aplicação está em versão demonstrativa. Colocar em cada layout
de área (site, admin, investidor, login) duplica markup e corre o
risco de alguém esquecer em uma nova rota.

**Decisão:** um único componente `DemoBanner` renderizado dentro do
`<body>` do `src/app/layout.tsx` (root layout). Assim, qualquer rota
nova herda automaticamente o aviso. Barra slim, cor ink-900, texto
ink-200, 11px — visualmente baixa, presente em 100% das páginas.
Não é sticky para não competir com navbars/sidebars das áreas
autenticadas.

**Consequências:**
- Cobertura universal sem duplicação.
- Remover/alterar o banner = editar um único arquivo.
- Quando a aplicação sair de "demo", basta excluir o componente e a
  linha no root layout — zero impacto no resto.

---

## ADR-013 — Cadastro de investidor (admin) separado do usuário de login

**Contexto:** o admin precisa gerenciar "investidores" (criar, listar,
editar, excluir). Já existe `MOCK_USERS` para autenticação. Misturar
os dois confunde conceitos e engessa a migração para auth real.

**Decisão:** dois conjuntos separados.
- `src/mocks/users.ts` — usuários de login (admin + investor user
  de demo). Usado pelo middleware e pelo fluxo de autenticação.
- `src/mocks/investorProfiles.ts` + `src/types/investorProfile.ts` —
  cadastros administrativos (dados cadastrais, status, observações).
  Usado pelo CRUD de `/admin/investidores`.

A amarração entre os dois se dá por e-mail (ou por `userId` em
produção). Na demo, o email do usuário de login coincide com o email
do cadastro "Marina Azevedo".

**Consequências:**
- O CRUD administrativo não mexe em login. Criar um cadastro não cria
  um usuário — em produção, isso será uma operação subsequente
  (convite por e-mail, por exemplo).
- Migrar a autenticação (NextAuth/Clerk) não afeta o cadastro
  administrativo.
- A UI segue o mesmo padrão do CRUD de posts (formulário + tabela +
  rotas aninhadas), o que mantém a base consistente.

---

## ADR-014 — `lib/currentInvestor` como ponto único de amarração sessão↔perfil

**Contexto:** ao passar a ter múltiplos investidores com aportes
distintos, o portal do investidor precisa filtrar estritamente pelos
aportes do investidor logado. Misturar esse filtro em cada page/route
handler (via `session.userId` + lookup em users + filtro em aportes)
repete lógica em pelo menos 4 pontos — risco de esquecer um e vazar
dados de outro investidor.

**Decisão:** centralizar a resolução em `src/lib/currentInvestor.ts`,
que expõe:
- `getCurrentInvestorProfileId(): string | null`
- `getCurrentInvestorAportes(): Aporte[]`

A amarração física é `MOCK_USERS[i].investorProfileId` → `InvestorProfile.id`.
O dashboard admin, ao contrário, sempre parte de `MOCK_APORTES` e
aplica o filtro pelo `?investor=<id>` vindo do `searchParams`.

**Consequências:**
- UM ponto para trocar ao migrar para auth real (ex.: claim no JWT).
- Páginas e route handlers do portal do investidor têm 1 linha para
  obter os aportes — `getCurrentInvestorAportes()`.
- Admin dashboard nunca passa por esse helper; ele lê `MOCK_APORTES`
  direto e aplica o filtro pela query string. Os dois fluxos ficam
  explicitamente diferentes, o que é o comportamento correto.
