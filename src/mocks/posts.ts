import type { BlogPost, BlogPostInput, PostStatus } from "@/types/blog";
import { slugify } from "@/utils/slugify";

/**
 * Store em memória dos posts do blog.
 *
 * Em produção, este módulo é substituído por uma camada de persistência
 * real (Postgres + Prisma, por exemplo). A interface pública (`listPosts`,
 * `getPostBySlug`, `getPostById`, `createPost`, `updatePost`, `deletePost`)
 * não muda — só a implementação interna.
 *
 * Observação: em dev do Next.js o módulo é cacheado enquanto o processo
 * estiver vivo, então as alterações via admin persistem entre requests.
 * Restart zera (comportamento esperado para a demo).
 */

const SEED_POSTS: BlogPost[] = [
  {
    id: "post_001",
    slug: "como-a-geracao-distribuida-funciona",
    title: "Como a geração distribuída de energia solar funciona na prática",
    excerpt:
      "Entenda em 4 minutos o modelo pelo qual cooperados passam a participar economicamente de usinas solares com economia de até 95% na conta de luz.",
    content:
      "A geração distribuída de energia solar é um modelo em que frações econômicas de uma usina de geração ficam disponíveis para cooperados, que passam a ter direito proporcional ao resultado da usina e à compensação de créditos de energia na rede.\n\nNeste artigo da COOPERGAC, cobrimos os três pilares do modelo: (1) o ativo subjacente — as usinas em operação; (2) a vinculação cooperativa — o contrato que comprova a participação; (3) a camada de transparência — o portal do cooperado, que é exatamente o que você está explorando nesta demo.\n\nNão há mágica financeira: o que existe é redução de atrito, rastreabilidade e um relacionamento mais direto entre quem gera energia limpa e quem investe. Tudo amparado pela Lei 14.300 (Marco Legal da Geração Distribuída).",
    author: "Equipe COOPERGAC",
    coverImage: "https://images.unsplash.com/photo-1509390157308-6a4f31e1a0a1?auto=format&fit=crop&w=1200&q=60",
    tags: ["geração distribuída", "energia solar", "educativo"],
    status: "published",
    createdAt: "2026-01-15T13:00:00Z",
    updatedAt: "2026-01-15T13:00:00Z",
    publishedAt: "2026-01-15T13:00:00Z"
  },
  {
    id: "post_002",
    slug: "porque-energia-solar-no-nordeste",
    title: "Por que o Nordeste é o coração da nossa operação",
    excerpt:
      "Irradiação solar acima da média mundial, regulação madura e ecossistema local em crescimento: entenda a tese geográfica da COOPERGAC.",
    content:
      "Quando desenhamos o portfólio da COOPERGAC, começamos pela pergunta mais simples: onde o sol rende mais por real investido? A resposta, no Brasil, é o Nordeste.\n\nPetrolina, Juazeiro, Mossoró e Barreiras combinam três fatores raros juntos: irradiação solar excepcional, infraestrutura de transmissão madura e custo de aquisição de terra competitivo. Isso se reflete diretamente no fator de capacidade das nossas usinas e, consequentemente, na previsibilidade dos rendimentos exibidos no portal.\n\nEsta demo traz um mapa com as usinas atuais — operando, em construção e planejadas — para que você visualize a distribuição geográfica do portfólio de forma concreta.",
    author: "Equipe COOPERGAC",
    coverImage: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=60",
    tags: ["nordeste", "estratégia", "usinas"],
    status: "published",
    createdAt: "2026-02-20T12:30:00Z",
    updatedAt: "2026-02-20T12:30:00Z",
    publishedAt: "2026-02-20T12:30:00Z"
  },
  {
    id: "post_003",
    slug: "transparencia-como-produto",
    title: "Transparência como produto, não como marketing",
    excerpt:
      "Por que a COOPERGAC trata a consulta do cooperado como uma peça central do produto — e não como uma obrigação de compliance.",
    content:
      "Cooperado bem informado é cooperado tranquilo. Essa frase parece óbvia, mas poucos players do mercado de energia tratam a camada de consulta como prioridade de produto.\n\nNa COOPERGAC, o portal que você está navegando nesta demo é pensado com a mesma exigência técnica de um dashboard de fintech: KPIs consolidados, evolução mensal histórica, mapa das usinas vinculadas e o contrato acessível com um clique. Tudo isso apenas para consulta — não há qualquer movimentação financeira via portal, por desenho.\n\nQuando evoluirmos para a versão de produção, a arquitetura atual permite trocar a origem dos dados (mocks → API real) sem redesenhar a experiência. Energia que une, fé que move, futuro que transforma.",
    author: "Equipe COOPERGAC",
    coverImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=60",
    tags: ["transparência", "produto", "cooperado"],
    status: "draft",
    createdAt: "2026-03-10T10:00:00Z",
    updatedAt: "2026-03-10T10:00:00Z"
  }
];

let POSTS: BlogPost[] = [...SEED_POSTS];

export function listPosts(filter?: { status?: PostStatus }): BlogPost[] {
  const base = POSTS.slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  if (!filter?.status) return base;
  return base.filter((p) => p.status === filter.status);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function getPostById(id: string): BlogPost | undefined {
  return POSTS.find((p) => p.id === id);
}

function uniqueSlug(base: string, ignoreId?: string): string {
  const normalized = slugify(base);
  let candidate = normalized || "post";
  let i = 2;
  while (POSTS.some((p) => p.slug === candidate && p.id !== ignoreId)) {
    candidate = `${normalized}-${i++}`;
  }
  return candidate;
}

export function createPost(input: BlogPostInput): BlogPost {
  const now = new Date().toISOString();
  const id = `post_${Math.random().toString(36).slice(2, 10)}`;
  const post: BlogPost = {
    id,
    slug: uniqueSlug(input.slug || input.title),
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    author: input.author,
    coverImage: input.coverImage,
    tags: input.tags ?? [],
    status: input.status ?? "draft",
    createdAt: now,
    updatedAt: now,
    publishedAt: input.status === "published" ? now : undefined
  };
  POSTS = [post, ...POSTS];
  return post;
}

export function updatePost(id: string, patch: Partial<BlogPostInput>): BlogPost | null {
  const idx = POSTS.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const prev = POSTS[idx];
  const now = new Date().toISOString();
  const nextStatus = patch.status ?? prev.status;
  const next: BlogPost = {
    ...prev,
    ...patch,
    slug:
      patch.slug || (patch.title && patch.title !== prev.title)
        ? uniqueSlug(patch.slug || patch.title || prev.title, id)
        : prev.slug,
    tags: patch.tags ?? prev.tags,
    status: nextStatus,
    updatedAt: now,
    publishedAt:
      nextStatus === "published"
        ? prev.publishedAt ?? now
        : undefined
  };
  POSTS[idx] = next;
  return next;
}

export function deletePost(id: string): boolean {
  const before = POSTS.length;
  POSTS = POSTS.filter((p) => p.id !== id);
  return POSTS.length < before;
}
