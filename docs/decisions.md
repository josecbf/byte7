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

---

## ADR-015 — Hosting na Vercel (conta pessoal, zero config)

**Contexto:** precisávamos colocar a demo online para demonstração.
Opções óbvias: Vercel, Netlify, Render, Fly.io, VPS próprio. A
aplicação é Next.js 14 App Router puro, sem backend externo nem
banco — o que favorece o fit nativo da Vercel (framework deles,
deploy em segundos, edge middleware sem config).

**Decisão:** deploy na **Vercel**, no escopo pessoal
`jcbezerrafh-3914`, projeto `byte7`. Sem variáveis de ambiente
configuradas no dashboard — a demo usa defaults do código
(`NEXT_PUBLIC_DATA_SOURCE=mock`). Alias de produção:
https://byte7.vercel.app.

**Consequências:**
- Deploy subsequente: `vercel` gera preview, `vercel --prod` promove.
  No **primeiro** deploy de um projeto novo, o `vercel --yes` foi
  direto para produção — fica registrado aqui para não surpreender
  numa próxima vez.
- Quando a autenticação sair do mock, será preciso criar as env vars
  (ex.: `SESSION_SECRET`, `NEXT_PUBLIC_API_BASE_URL`) no dashboard
  Vercel antes de promover.
- Quando a identidade visual oficial chegar, re-deploy é só push →
  rebuild automático.
- Migrar para outro host (Netlify / self-hosted Node) é localizado:
  Next.js 14 roda em qualquer lugar; só precisaríamos replicar o
  middleware como função edge ou node.
- Arquivo `.vercel/` ficou local (já estava no `.gitignore`) — a
  ligação projeto↔conta é recriada com `vercel link` em qualquer
  máquina nova.

---

## ADR-016 — Papel `editor` separado e CRUD de blog parametrizado por `basePath`

**Contexto:** o papel `admin` acumulava duas responsabilidades que
pertencem a perfis distintos no mundo real: gerenciar investidores
(operacional/financeiro) e editar o blog (marketing/conteúdo). Dar
acesso total ao blog exigia conceder acesso a dados sensíveis. O
requisito foi separar:

- **editor** — acesso exclusivo à edição do blog (posts).
- **admin** — acesso a tudo que o editor tem **mais** gestão de
  investidores e resultados consolidados.

**Decisão:** três eixos — papel, URL, código.

1. **Papel.** `UserRole = "admin" | "editor" | "investor"`. Um helper
   `canEditBlog(session)` em `src/lib/session.ts` retorna true para
   `admin` **ou** `editor`; é usado pelas route handlers de
   `/api/posts/*`. `matchesRole` continua sendo usado onde o acesso
   é estritamente de um papel (layouts guards, `/api/investors/*`).

2. **URL.** Área nova `/editor/*` espelhando o padrão existente:
   `/editor/login` + `/editor/(protected)/...`. Middleware protege
   `/editor/**` exigindo `role === "editor"`. Admin **não** entra em
   `/editor/*` — já tem `/admin/posts`, e evita URL duplicada para o
   mesmo UX. Editor **não** entra em `/admin/*`.

3. **Código.** Os componentes client que fazem o CRUD de posts
   foram movidos para `src/components/blog/` e ganharam uma prop
   `basePath: string` (ex.: `"/admin"` ou `"/editor"`). Esse
   `basePath` é o único ponto de divergência entre as duas áreas —
   links internos (novo post, editar, voltar para lista) são
   montados com template string sobre ele. Os server pages nas duas
   áreas ficam idênticos exceto pelo valor da prop.

**Consequências:**

- Adicionar uma 3ª área com capacidade de editar blog (ex.:
  `/parceiros/posts`) é só criar outra árvore de pages com
  `basePath="/parceiros"` — zero refactor nos componentes.
- Ampliar permissão do editor (ex.: deixar editor ver um novo
  relatório) é uma linha: checar `canEditBlog` ou criar outro
  helper. Não precisa mexer no middleware por conta de ACL fina.
- O contrato do cookie `byte7_session` não mudou (continua
  `{ userId, role, name }`), só o conjunto de valores válidos de
  `role`. Migração para auth real não é afetada.
- Admin continua com o fluxo que já tinha em `/admin/posts` — zero
  mudança de UX para quem já usava o painel.
- Único trade-off: existem **duas** páginas idênticas (`posts/new`,
  `posts/[id]/edit`, `posts/page`) em `/admin` e `/editor`. A
  duplicação é trivial (cada uma tem ~20 linhas e apenas o
  `basePath` muda), e é preferível à alternativa de fazer uma única
  page com `basePath` dinâmico derivado do `pathname` — que
  complicaria o server component e quebraria a clareza de "essa
  URL pertence a essa área".

**Credenciais da demo (editor):** `editor@byte7.com.br` / `editor123`.

---

## ADR-017 — `MonthlyStatement` sobrescreve o cálculo quando presente

**Contexto:** ADR-007 consolidou que o rendimento exibido na demo era
6% a.m. aplicado matematicamente sobre os aportes. Isso torna o
dashboard "tudo bate matematicamente", mas não responde à pergunta
"quando virar o mês, como o investidor vê a rentabilidade real de
maio?". Em produção, o operacional registra o desempenho real do mês;
na demo, precisamos de um análogo que o admin possa preencher.

**Decisão:** introduzir o modelo `MonthlyStatement` com shape
`(investorId, month, invested, rate, balance, note?)`. A função
`buildMonthlyEvolution(aportes, statements, rate)` trabalha assim:

1. Monta o baseline com `buildSeries(aportes, () => 6%)`.
2. Para cada mês que tem statement registrado, substitui
   `invested/balance/yieldAmount` pelos valores do statement.
3. Meses sem statement permanecem no fallback 6% a.m.

O override é **pontual** — registrar statement para o mês N não
propaga para o mês N+1. Se o admin quiser continuidade visual, precisa
registrar statements para cada mês subsequente. Na prática, é isso que
vai acontecer (admin registra todo mês). Enquanto ele não registra, o
fallback 6% segue aparecendo.

**Consequências:**
- ADR-007 continua valendo como *fallback*, não mais como verdade
  absoluta. A parte "tudo bate" passa a depender da consistência do
  que o admin registrar (decisão aceita pelo usuário).
- `rate` é armazenado como fração (`0.06 = 6%`). A UI do formulário
  trabalha em %, converte para decimal na submissão.
- `buildDashboardSummary` passa a usar `last.invested` da série
  ajustada como KPI "Total investido". Se o último mês tem statement,
  mostra o valor registrado; senão, soma bruta dos aportes.
- Chaves naturais `(investorId, month)` → store rejeita duplicata com
  409. Alterar mês na edição é permitido, mas continua checando
  unicidade.
- Migrar para backend real preserva o modelo: troca o store em memória
  por tabela `monthly_statements` com índice único composto.
- Investidor sem aportes mas com statements é caso suportado (série
  construída direto dos statements); no chart comparativo,
  CDI/Ibovespa permanecem zerados nesse cenário (sem aportes para
  aplicar a taxa).

**Seed:** intencionalmente NÃO semeamos statements. O dashboard
continua visualmente idêntico ao de antes (rodando no fallback 6%)
até o admin começar a registrar. Isso facilita reproduzir o cenário
"virou o mês, preciso registrar maio" demonstrativamente.

---

## ADR-018 — Log de auditoria append-only com helper único

**Contexto:** o usuário pediu que toda movimentação (criação, edição,
exclusão de dados financeiros e cadastrais) fosse logada com quem,
quando e o que mudou, "muito cuidadoso e auditável". Precisamos de:
(a) storage que impeça alteração de entradas passadas; (b) um ponto
único para registrar auditoria (evitar esquecer em alguma rota); (c)
uma tela para consultar o log com filtros úteis.

**Decisão:** três peças.

1. **Modelo**. `AuditLogEntry = {id, timestamp, actorId, actorName,
   action, entity, entityId, investorId, before, after, source, note?}`.
   `action ∈ create|update|delete`, `entity ∈ aporte|statement|
   investor_profile`, `source ∈ ui|excel_upload`. `before`/`after` são
   snapshots parciais do registro (null nas criações/exclusões).

2. **Store append-only**. `src/mocks/auditLog.ts` expõe apenas
   `appendAudit` e `listAudit`. Não há updateAudit nem deleteAudit.
   Esse é o *invariante* que torna o log auditável: uma vez registrada,
   a entrada não se altera.

3. **Helper único**. `src/lib/audit.ts::recordAudit({session, action,
   entity, entityId, investorId, before, after, source?})` é o único
   caminho usado pelas rotas para gerar uma entrada. Ator é sempre
   resolvido a partir da sessão — chamador não pode forjar.

**Consequências:**
- Qualquer mutação futura que esquecer de chamar `recordAudit` vira
  buraco no log. Mitigação: auditar code review + centralizar lógica
  em wrappers quando possível (ainda não fizemos, mas a porta fica
  aberta).
- Filtros da tela `/admin/auditoria` são implementados em
  `listAudit(filters)` e expostos via `/api/audit`: investidor,
  entidade, origem, ator, janela de datas.
- A tela expande cada linha para mostrar `before/after` como JSON
  bruto, para debug/prova. O "resumo" na linha colapsada sintetiza
  diff (mostra `campo: antes → depois` dos 3 campos que mudaram,
  ignorando metadados `id/createdAt/updatedAt/etc`).
- `source: "excel_upload"` já está no tipo, mesmo sem o import de
  Excel implementado ainda (Sessão 9). Isso evita mexer no schema
  depois.
- Migrar para backend real: tabela `audit_log` com triggers ou escrita
  explícita em cada endpoint. O shape do payload não muda.

---

## ADR-019 — Append-only em aportes e statements

**Contexto:** ADR-018 registra mutações no log de auditoria, mas o
próprio store de aportes/statements ainda era mutável (PUT sobrescrevia
valores). O usuário pediu que a **tabela em si** fosse append-only:
uma correção deve deixar o valor errado e o certo *ambos* no banco,
com o investidor enxergando só o atual e o admin conseguindo ver a
trilha histórica. Isso fortalece a prova de auditabilidade — o valor
errado não existe só no log, existe *no store principal*.

**Decisão:** introduzir dois marcadores em cada registro de
`Aporte` e `MonthlyStatement`:

- `supersededBy: string | null` + `supersededAt: string | null` —
  preenchidos quando o registro foi substituído por outro.
- `voidedAt: string | null` + `voidedBy: string | null` —
  preenchidos quando o admin clicou em "Invalidar" (soft-delete).

"Ativo" = `supersededBy === null && voidedAt === null`. A camada de
listagem padrão devolve só ativos; `includeInactive: true` devolve
tudo. Sem update em nenhum dos dois stores — os caminhos de mutação
são `create` (que pode supersede em atomic step) e `void` (soft-delete).

**Chave de supersede por entidade:**
- **Statements**: chave natural `(investorId, month)`. `createStatement`
  detecta ativo no mesmo mês e faz supersede automaticamente — o
  admin nem precisa saber qual id está substituindo.
- **Aportes**: sem chave natural. O chamador precisa passar
  `supersedes: aporte_id` explicitamente para amarrar correção ao
  registro antigo. Sem isso, é um aporte independente.

**API externa:**
- `POST /api/.../aportes` ou `/statements` — único caminho para
  criar/corrigir. Aceita o input normal + `supersedes?`.
- `DELETE /api/.../[id]` — soft-delete (void). Retorna 204 se voidou,
  409 se o registro já não estava ativo.
- `PUT` foi **removido** de ambas as rotas.

**Auditoria:**
Uma correção gera **duas** entradas:
1. `action=update` no registro antigo (`supersededBy` vai de null → new_id),
   com `note: "Substituído por X"`.
2. `action=create` no registro novo, com `note: "Substitui Y"`.

Uma invalidação gera uma entrada:
- `action=delete` no registro (só `voidedAt/By` mudam), com
  `note: "Invalidado (soft-delete)"`. A palavra `delete` reflete a
  INTENÇÃO do admin — o row continua no banco.

**Consequências:**
- O investidor continua vendo apenas o estado atual — nenhuma
  regressão de UX. A página do admin em `/financeiro` ganhou badges
  "Ativo / Substituído / Invalidado" para o operador enxergar o
  histórico direto (sem precisar abrir a auditoria toda hora).
- O dashboard admin e o overview `/admin` consomem `listAportes()`
  e `listStatements()` sem flags — o filtro padrão é active. Não
  precisou mudar chamadas.
- A auditoria por si só já tinha a trilha antes (via `before/after`),
  mas agora **o store principal também é auditável sem auditoria**:
  mesmo sem log, todas as versões estão lá com tombstone. O log fica
  como *quem/quando*; o store fica como *o quê*.
- Migrar para backend real: tabelas `aportes` e `monthly_statements`
  ganham os 4 campos. Nenhum UPDATE nos valores — só INSERT novos e
  UPDATE restrito a preencher os marcadores. Um índice parcial em
  `WHERE supersededBy IS NULL AND voidedAt IS NULL` suporta a query
  "ativos" eficientemente.
- Ao implementar o import Excel (Sessão 9), cada linha que corrige
  um registro existente seguirá o mesmo caminho: POST com
  `supersedes` (aportes) ou auto-supersede (statements), `source:
  "excel_upload"` na auditoria. Sem código novo no store.

---

## ADR-020 — Acesso do investidor criado pelo admin, senha nunca no log

**Contexto:** ADR-013 separou o cadastro administrativo
(`InvestorProfile`) do usuário de login (`MOCK_USERS`). Até a Sessão 8
a criação do usuário de login era manual (via edição do seed). Os
novos requisitos são: o admin precisa **criar acesso** para um
cadastro que ainda não tem login e **redefinir senha** quando
preciso, com auditoria completa. O ponto sensível: auditoria não pode
vazar credenciais.

**Decisão:** três pedaços.

1. **Uma nova entidade de auditoria: `user_login`.** Todas as operações
   sobre credenciais (create, reset) geram entrada com
   `entity="user_login"`, `investorId` = `InvestorProfile.id` e
   `entityId` = `user.id`. Filtro extra na tela `/admin/auditoria`.
2. **Senha nunca aparece no log.**
   - `create`: `after` é o resultado de `toPublicUser(user)` — tudo
     menos `password` (usamos `const { password: _pw, ...rest } = user`).
   - `update` (reset): `before` e `after` são ambos `null`. O rastro
     é "quem/quando/qual usuário" via `actorId`, `timestamp`,
     `entityId`. O valor novo e o antigo nunca são persistidos —
     nem o log rico do `before/after` tenta adivinhar.
   - Validação: todo `appendAudit` passa pelos helpers em `lib/audit.ts`,
     que nunca leem `password`. Um teste manual percorrendo
     `JSON.stringify(entry)` não encontra a senha.
3. **Criação e reset via `/api/investors/[id]/login`.** Em vez de
   rotas globais `/api/users/...`, amarramos ao `InvestorProfile`:
   - `POST /api/investors/[id]/login` — 201 com usuário sanitizado.
     Nome/e-mail default vêm do profile (admin pode sobrescrever).
   - `GET /api/investors/[id]/login` — `null` quando não há acesso.
     Usado pela página `/admin/investidores/[id]/edit` para decidir
     entre "criar" e "redefinir".
   - `PUT /api/investors/[id]/login/password` — 404 se não há acesso,
     400 se a senha é inválida (mínimo 6 caracteres). Sucesso é
     `{ ok: true }` — não retornamos o usuário nem eco da senha.

**Consequências:**
- `MOCK_USERS` continua sendo o store de login — sem múltiplos usuários
  por investidor. A tentativa de criar um 2º login para o mesmo
  `investorProfileId` devolve 409. Mesma lógica para e-mail duplicado.
- O fluxo de criação **não** redefine senha. Se o admin precisa trocar
  a senha de uma conta recém-criada, o caminho é o `PUT /password`
  (mesmo ponto único). Isso evita bifurcação de auditoria.
- Em produção: trocar store por backend real mantém a mesma superfície
  — rotas e shape do log não mudam. O backend deve armazenar hash da
  senha (bcrypt/argon2), nunca o valor cru. Auditoria continua sem
  snapshot.
- A criação de credenciais pelo admin **não é** o fluxo recomendado a
  longo prazo — em produção, o ideal é emitir um token por e-mail
  para o próprio investidor definir a senha. Este ADR vale para a
  demo; quando migrarmos, o mesmo endpoint POST passa a emitir o
  token em vez de aceitar a senha no payload.

**Credenciais criadas na demo (quando admin usar esta tela)**: ficam
em memória; restart do servidor volta ao seed (admin/editor/
investidor=marina).

---

## ADR-021 — Excel de lançamentos: round-trip idempotente + `source=excel_upload`

**Contexto:** o admin precisa registrar mês a mês rentabilidade/posição
de cada investidor. Preencher via UI exige clicar linha a linha; em
prática, o operacional vai trabalhar em planilha com dezenas de
linhas. Precisamos de um fluxo "baixa .xlsx → edita → reenvia" que
seja **seguro** (sem perder histórico), **auditável** (rastro de
quem alterou o quê via Excel) e **previsível** (reenviar o mesmo
arquivo não duplica registros).

**Decisões principais:**

1. **Biblioteca: `exceljs`, não `xlsx` (SheetJS).**
   O pacote `xlsx` no npm tem dois advisories de segurança altos
   (Prototype Pollution, ReDoS) **sem fix disponível** — SheetJS
   migrou distribuição para fora do npm. `exceljs` é alternativa
   ativamente mantida, com API de fácil leitura. O único advisory
   indireto é moderate (via `uuid`), e não nos afeta.

2. **Escopo do arquivo: só statements.**
   Linha = `(investor, mês)`. Aportes continuam na UI per-investidor
   (são transações com data e usina — não se encaixam bem em "um
   mês por linha"). Ao tentar colocar os dois na mesma planilha,
   as colunas brigariam: cada linha teria metade preenchida.
   Manter o escopo resolve isso sem perder funcionalidade.

3. **Semântica de apuração por linha.**
   - Investor inexistente → `error` (não cria nada).
   - Sem ativo para `(investor, mês)` → `created`.
   - Ativo existe e valores batem (tolerância `0.005 BRL`, `1e-6`
     na taxa) → `unchanged`. **Round-trip do próprio export é
     sempre no-op** — propriedade crítica para o admin confiar.
   - Ativo existe com valores diferentes → `superseded` (via
     `createStatement` da ADR-019; o antigo é marcado, não apagado).

4. **Remoção de linhas do arquivo NÃO invalida statements.**
   Se o admin exclui uma linha da planilha e reenvia, o statement
   correspondente **continua ativo**. Para invalidar, usa-se o
   botão "Invalidar" na UI (DELETE soft-delete). Isso evita que
   um "apagão" acidental na planilha limpe dados de produção.

5. **Auditoria ganha origem `excel_upload`.**
   Campo `source` do `AuditLogEntry` já estava preparado (ADR-018).
   Todas as entradas geradas pelo import passam `source:
   "excel_upload"` em vez do default `"ui"`. O `note` referencia
   o número da linha no Excel para rastreamento.

**Layout do arquivo:**

| ID Investidor | Investidor | Mês (YYYY-MM) | Investido (R$) | Taxa do mês (%) | Saldo (R$) | Observação |
|---|---|---|---|---|---|---|
| inv_001 | Marina Azevedo | 2026-03 | 145000 | 6 | 153700 | (opcional) |

- `ID Investidor`, `Mês`, `Investido`, `Taxa`, `Saldo` são
  obrigatórios. `Investidor` é informativo (cópia do `fullName` no
  export; ignorado no import — a chave é o ID). `Observação` opcional.
- Taxa sai como percentual (0.06 → 6), não fração — é o que o
  operacional espera ver. Na importação, dividimos por 100.

**Consequências:**

- Dry-run/preview antes de aplicar ficou fora desta sessão. Caso o
  admin cometa erro em massa, a trilha de auditoria + supersede
  permite reverter por outro upload corretivo (os antigos viram
  ativos de novo registrando os valores corretos). Se virar
  recorrente, adicionar `?dryRun=true` é trivial (a função de apply
  já separa fase de validação da de aplicação).
- Em produção: trocar store em memória por backend muda só a
  implementação dos helpers `createStatement`/`listStatements`. A
  camada de Excel (parse/serialize/route handlers) não muda.
- Tamanho do arquivo: com 500 investidores × 24 meses = 12k linhas,
  o `exceljs` ainda trabalha em memória sem stream. Ao ultrapassar
  esse limite, considerar `ExcelJS.stream.xlsx.WorkbookReader` ou
  processar em chunks.
