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
