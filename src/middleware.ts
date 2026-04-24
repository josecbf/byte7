import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, decodeSession } from "@/lib/session";

/**
 * Middleware global de autenticação (mock).
 *
 * Protege:
 *   /admin/**       → exige sessão com role=admin (exceto /admin/login)
 *   /editor/**      → exige sessão com role=editor (exceto /editor/login)
 *   /investidor/**  → exige sessão com role=investor (exceto /investidor/login)
 *
 * Se já estiver logado no papel adequado, redireciona o *login* de volta
 * para o respectivo dashboard — evita tela de login para quem já entrou.
 */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  const session = decodeSession(cookie);

  // Admin area
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      if (session?.role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next();
    }
    if (session?.role !== "admin") {
      const url = new URL("/admin/login", req.url);
      url.searchParams.set("redirect", pathname + search);
      return NextResponse.redirect(url);
    }
  }

  // Editor area
  if (pathname.startsWith("/editor")) {
    if (pathname === "/editor/login") {
      if (session?.role === "editor") {
        return NextResponse.redirect(new URL("/editor", req.url));
      }
      return NextResponse.next();
    }
    if (session?.role !== "editor") {
      const url = new URL("/editor/login", req.url);
      url.searchParams.set("redirect", pathname + search);
      return NextResponse.redirect(url);
    }
  }

  // Investor area
  if (pathname.startsWith("/investidor")) {
    if (pathname === "/investidor/login") {
      if (session?.role === "investor") {
        return NextResponse.redirect(new URL("/investidor", req.url));
      }
      return NextResponse.next();
    }
    if (session?.role !== "investor") {
      const url = new URL("/investidor/login", req.url);
      url.searchParams.set("redirect", pathname + search);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/editor/:path*", "/investidor/:path*"]
};
