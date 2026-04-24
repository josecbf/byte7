import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, canEditBlog, decodeSession } from "@/lib/session";
import { getPostBySlug } from "@/mocks/posts";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: { slug: string } }) {
  const post = getPostBySlug(ctx.params.slug);
  if (!post) {
    return NextResponse.json({ message: "Post não encontrado." }, { status: 404 });
  }
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (post.status === "draft" && !canEditBlog(session)) {
    return NextResponse.json({ message: "Post não encontrado." }, { status: 404 });
  }
  return NextResponse.json(post);
}
