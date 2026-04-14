# TODO — Byte7 Demo

> Pendências e melhorias conhecidas. Marcar com `[x]` quando concluído.

## Entregue na Sessão 1

- [x] Estrutura de pastas e configs base
- [x] Docs iniciais (context, log, decisions, todo)
- [x] Tipos, mocks e services
- [x] API routes mockadas
- [x] Middleware de auth
- [x] Componentes UI e layouts
- [x] Site institucional completo
- [x] Blog público
- [x] Admin do blog (CRUD completo com status publicado/rascunho)
- [x] Login de investidor
- [x] Dashboard do investidor (KPIs, gráfico, aportes, mapa, contrato)
- [x] README

## Backlog curto (melhorias "baixo custo")

- [ ] Tela pública "Contato" com formulário mockado
- [ ] Filtro/ordenação de aportes na tabela
- [ ] Paginação no blog público quando passar de N posts
- [ ] Tela de perfil do investidor (somente leitura)
- [ ] Skeleton loaders nas páginas que consomem `services/*`

## Próximos passos estruturais (rumo à produção)

- [ ] Substituir mocks por API real
  - criar backend (ex.: NestJS, Hono, FastAPI)
  - apontar `NEXT_PUBLIC_API_BASE_URL`
  - setar `NEXT_PUBLIC_DATA_SOURCE=api`
  - remover `src/app/api/*` e `src/mocks/*`
- [ ] Auth real (NextAuth / Clerk / backend próprio)
  - manter o cookie `byte7_session` como interface ou migrar o middleware
- [ ] Persistência real para posts (Postgres + Prisma é o mais direto)
- [ ] Upload de imagens para os posts (S3/Cloudinary)
- [ ] SEO: sitemap, Open Graph, metadata por rota
- [ ] Testes (Vitest + Playwright)
- [ ] Observabilidade (Sentry + métricas Vercel)
- [ ] Aplicar identidade visual oficial quando estiver pronta

## Decisões pendentes do time de negócio

- [ ] Definir identidade visual definitiva (logo, paleta, tipografia).
- [ ] Definir taxa real / contrato real (hoje a demo usa 6% a.m. fixo).
- [ ] Definir fluxo de onboarding de investidor (hoje só login).
