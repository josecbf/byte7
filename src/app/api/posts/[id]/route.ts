import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, decodeSession, matchesRole } from "@/lib/session";
import { deletePost, getPostById, updatePost } from "@/mocks/posts";
import type { BlogPostInput } from "@/types/blog";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const post = getPostById(ctx.params.id);
  if (!post) {
    return NextResponse.json({ message: "Post não encontrado." }, { status: 404 });
  }
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (post.status === "draft" && !matchesRole(session, "admin")) {
    return NextResponse.json({ message: "Post não encontrado." }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PUT(req: Request, ctx: { params: { id: string } }) {
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (!matchesRole(session, "admin")) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }
  const patch = (await req.json().catch(() => null)) as Partial<BlogPostInput> | null;
  if (!patch) {
    return NextResponse.json({ message: "Payload inválido." }, { status: 400 });
  }
  const post = updatePost(ctx.params.id, patch);
  if (!post) {
    return NextResponse.json({ message: "Post não encontrado." }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (!matchesRole(session, "admin")) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }
  const ok = deletePost(ctx.params.id);
  if (!ok) {
    return NextResponse.json({ message: "Post não encontrado." }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
