# Byte7 Demo — Contexto do Projeto

> Este arquivo é a **memória operacional** do projeto. Se uma nova sessão
> começar do zero, a leitura deste documento (+ `session_log.md`,
> `decisions.md` e `todo.md`) deve ser suficiente para retomar o trabalho
> sem depender de contexto efêmero de conversa.

## 1. O que é o projeto

**Byte7 Demo** é uma aplicação web demonstrativa da Byte7, empresa que
atua com **intermediação de tokenização de energia**.

A demo combina:

1. **Site institucional** (Home, Sobre, Valores, Produtos, Blog).
2. **Área administrativa do blog** (login admin + CRUD de posts).
3. **Portal do investidor** (login + dashboard apenas de consulta com
   KPIs, evolução mensal, mapa de usinas e contrato).

## 2. Escopo e restrições (muito importante)

- É uma **DEMO**. Todos os dados são **mockados**.
- **Nenhuma movimentação financeira**. Nada de depósito, saque,
  transferência, compra ou venda. A área do investidor é **apenas
  leitura** — consulta de informações.
- Rendimento exibido é fixo em **6% ao mês** (parâmetro da demo, não
  promessa financeira).
- Identidade visual oficial **ainda não existe**; a demo usa um visual
  provisório limpo e profissional (paleta verde/slate).
- A arquitetura deve permitir **trocar os mocks por uma API real com
  retrabalho mínimo**.

## 3. Stack

- **Next.js 14 (App Router)** + **TypeScript** + **Tailwind CSS**
- **Recharts** (gráficos)
- **react-leaflet** + OpenStreetMap (mapa das usinas)
- **React Hook Form** + **Zod** (formulários + validação)
- **lucide-react** (ícones)
- **date-fns** (formatação de datas)

Sem bibliotecas de UI pesadas (shadcn, MUI, etc.) — componentes
primitivos próprios em Tailwind, para facilitar a troca pela identidade
visual oficial depois.

## 4. Arquitetura de dados

A camada de dados é dividida em:

```
src/mocks      → dados mockados (fonte da verdade na demo)
src/services   → API pública da camada de dados (consumida pela UI)
src/app/api/*  → route handlers que expõem os mocks via HTTP
```

Os **services** decidem em runtime de onde vêm os dados, guiados por
`NEXT_PUBLIC_DATA_SOURCE`:

- `mock` (padrão da demo) → services leem diretamente dos mocks
  (ou via fetch para as próprias route handlers internas).
- `api` (futuro) → services chamam `NEXT_PUBLIC_API_BASE_URL`.

Trocar os mocks por uma API real consiste em:

1. apontar `NEXT_PUBLIC_API_BASE_URL` para o backend;
2. setar `NEXT_PUBLIC_DATA_SOURCE=api`;
3. (opcional) remover `src/app/api/*` e `src/mocks/*`.

Nenhuma página/componente precisa mudar.

## 5. Autenticação (mock)

Auth é mockada com um cookie `byte7_session` contendo JSON base64
(`{ userId, role, name }`). Um **middleware** protege:

- `/admin/**` → exige `role === "admin"`
- `/investidor/**` (exceto `/investidor/login`) → exige
  `role === "investor"`

Credenciais de demo estão em [`src/mocks/users.ts`](../src/mocks/users.ts)
e listadas no README.

## 6. Estrutura de pastas

Ver `README.md` seção "Estrutura de pastas". O que todo colaborador
precisa lembrar:

- **`src/app/(site)/`** → páginas institucionais (Navbar pública).
- **`src/app/admin/`** → área admin (layout próprio, exige login admin).
- **`src/app/investidor/`** → portal do investidor (layout próprio).
- **`src/mocks/`** → única fonte de dados na demo.
- **`src/services/`** → interface estável para a UI.
- **`src/types/`** → contratos TypeScript compartilhados.

## 7. Como retomar o trabalho

1. Ler este arquivo.
2. Ler `docs/session_log.md` (últimas sessões).
3. Ler `docs/todo.md` (o que ficou pendente).
4. Ler `docs/decisions.md` se houver dúvida sobre *por que* algo foi
   feito de certa forma.
5. Rodar `npm install && npm run dev` e navegar pela aplicação.
