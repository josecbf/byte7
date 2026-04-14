import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, decodeSession } from "@/lib/session";
import { MOCK_USERS } from "@/mocks/users";

export const runtime = "nodejs";

export async function GET() {
  const cookie = cookies().get(SESSION_COOKIE)?.value;
  const session = decodeSession(cookie);
  if (!session) return NextResponse.json(null);
  const user = MOCK_USERS.find((u) => u.id === session.userId);
  if (!user) return NextResponse.json(null);
  const { password: _pw, ...publicUser } = user;
  return NextResponse.json(publicUser);
}
