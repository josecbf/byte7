import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, encodeSession } from "@/lib/session";
import { findUserByCredentials } from "@/mocks/users";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
  };
  const { email = "", password = "" } = body;
  const user = findUserByCredentials(email, password, "admin");
  if (!user) {
    return NextResponse.json(
      { message: "Credenciais inválidas." },
      { status: 401 }
    );
  }
  cookies().set({
    name: SESSION_COOKIE,
    value: encodeSession({ userId: user.id, role: user.role, name: user.name }),
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8
  });
  return NextResponse.json(user);
}
