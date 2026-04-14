import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/format";
import { getPostBySlug } from "@/mocks/posts";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Post não encontrado" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: post.coverImage
      ? { images: [{ url: post.coverImage }] }
      : undefined
  };
}

export default function BlogPostPage({
  params
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post || post.status !== "published") notFound();

  return (
    <article className="py-12">
      <Container className="max-w-3xl">
        <Link
          href="/blog"
          className="text-sm text-brand-700 hover:text-brand-800"
        >
          ← Voltar ao blog
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-ink-500">
          <span>{formatDate(post.publishedAt ?? post.updatedAt)}</span>
          <span>·</span>
          <span>{post.author}</span>
        </div>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink-900">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-ink-600">{post.excerpt}</p>
        {post.tags.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <Badge key={t} tone="brand">
                {t}
              </Badge>
            ))}
          </div>
        ) : null}

        {post.coverImage ? (
          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(min-width: 768px) 720px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        ) : null}

        <div className="prose-byte7 mt-10">
          {post.content.split(/\n{2,}/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Container>
    </article>
  );
}
