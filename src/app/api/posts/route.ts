import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, decodeSession, matchesRole } from "@/lib/session";
import { createPost, listPosts } from "@/mocks/posts";
import type { BlogPostInput, PostStatus } from "@/types/blog";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const statusParam = url.searchParams.get("status");
  const status: PostStatus | undefined =
    statusParam === "draft" || statusParam === "published" ? statusParam : undefined;

  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  // Se não houver admin autenticado e não veio status explícito,
  // entregamos apenas posts publicados (visão pública).
  if (!matchesRole(session, "admin") && !status) {
    return NextResponse.json(listPosts({ status: "published" }));
  }
  return NextResponse.json(listPosts(status ? { status } : undefined));
}

export async function POST(req: Request) {
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (!matchesRole(session, "admin")) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as BlogPostInput | null;
  if (!body || !body.title || !body.content) {
    return NextResponse.json(
      { message: "Título e conteúdo são obrigatórios." },
      { status: 400 }
    );
  }
  const post = createPost(body);
  return NextResponse.json(post, { status: 201 });
}
