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
