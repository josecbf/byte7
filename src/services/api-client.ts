import { getApiBaseUrl } from "@/lib/env";

/**
 * Cliente HTTP genérico. No modo "mock" chama rotas internas (relative).
 * No modo "api" (futuro), prefixa com NEXT_PUBLIC_API_BASE_URL.
 */
export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  // se true, retorna Response cru (sem parse).
  raw?: boolean;
}

export async function apiRequest<T = unknown>(
  path: string,
  opts: RequestOptions = {}
): Promise<T> {
  const base = path.startsWith("http") ? "" : getApiBaseUrl() || "";
  const url = base ? `${base}${path}` : path;
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(opts.headers as Record<string, string> | undefined)
  };
  let body: BodyInit | undefined;
  if (opts.body !== undefined) {
    if (opts.body instanceof FormData) {
      body = opts.body;
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(opts.body);
    }
  }
  const res = await fetch(url, { ...opts, headers, body, cache: "no-store" });
  if (opts.raw) return res as unknown as T;
  if (!res.ok) {
    let detail: unknown = undefined;
    try {
      detail = await res.json();
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, res.statusText, detail);
  }
  // 204
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public detail?: unknown
  ) {
    super(`API ${status} ${statusText}`);
  }
}
