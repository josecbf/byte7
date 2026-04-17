import type { Session, UserRole } from "@/types/auth";

export const SESSION_COOKIE = "coopergac_session";

/**
 * Sessão mockada — JSON codificado em base64 gravado em cookie.
 *
 * IMPORTANTE: não é seguro para produção. Quando trocarmos para auth
 * real, o formato do cookie pode permanecer (mesma shape), mas a
 * emissão e validação passam a usar JWT assinado ou sessão server-side.
 */

function toBase64(input: string): string {
  if (typeof window === "undefined") {
    return Buffer.from(input, "utf8").toString("base64");
  }
  return window.btoa(unescape(encodeURIComponent(input)));
}

function fromBase64(input: string): string {
  if (typeof window === "undefined") {
    return Buffer.from(input, "base64").toString("utf8");
  }
  return decodeURIComponent(escape(window.atob(input)));
}

export function encodeSession(session: Session): string {
  return toBase64(JSON.stringify(session));
}

export function decodeSession(value: string | undefined | null): Session | null {
  if (!value) return null;
  try {
    const raw = fromBase64(value);
    const parsed = JSON.parse(raw) as Session;
    if (!parsed.userId || !parsed.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function matchesRole(session: Session | null, role: UserRole): boolean {
  return !!session && session.role === role;
}
