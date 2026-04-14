import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PostCard } from "@/components/blog/PostCard";
import { listPosts } from "@/mocks/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Conteúdos sobre tokenização de energia, estratégia e tecnologia — Byte7."
};

// Em demo, consumimos direto do módulo de mocks (mesmo runtime do servidor).
// Em produção (com API real), basta trocar para `blogService.list()`.
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = listPosts({ status: "published" });

  return (
    <section className="py-16">
      <Container>
        <p className="text-sm uppercase tracking-wider text-brand-700 font-medium">
          Blog
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink-900 max-w-2xl">
          Ideias, bastidores e análises sobre tokenização de energia.
        </h1>
        <p className="mt-3 text-ink-600 max-w-2xl">
          Publicações curtas, diretas e feitas pela equipe da Byte7.
        </p>

        {posts.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
            <p className="text-ink-600">
              Nenhum post publicado ainda.{" "}
              <Link href="/admin/login" className="text-brand-700 underline">
                Entre no admin
              </Link>{" "}
              para criar o primeiro.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
