"use client";

import { Fragment, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronRight, FilterX, Search } from "lucide-react";

import type { AuditLogEntry } from "@/types/audit";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Field } from "@/components/ui/Label";

interface InvestorOption {
  id: string;
  fullName: string;
}

/**
 * Resume em uma string os campos que mudaram entre `before` e `after`.
 * Omite metadados do store (createdAt/updatedAt/By) do resumo — eles
 * aparecem mesmo assim no payload bruto ao expandir a linha.
 */
const SUMMARY_IGNORED = new Set([
  "id",
  "createdAt",
  "updatedAt",
  "createdBy",
  "updatedBy"
]);

function summarizeDiff(
  before: Record<string, unknown> | null,
  after: Record<string, unknown> | null
): string {
  if (!before && after) {
    const entries = Object.entries(after).filter(
      ([k]) => !SUMMARY_IGNORED.has(k)
    );
    return entries
      .slice(0, 4)
      .map(([k, v]) => `${k}=${short(v)}`)
      .join(" · ");
  }
  if (before && !after) {
    return "registro removido";
  }
  if (!before || !after) return "";
  const changes: string[] = [];
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  for (const k of keys) {
    if (SUMMARY_IGNORED.has(k)) continue;
    const a = JSON.stringify(before[k]);
    const b = JSON.stringify(after[k]);
    if (a !== b) {
      changes.push(`${k}: ${short(before[k])} → ${short(after[k])}`);
    }
  }
  return changes.slice(0, 3).join(" · ") || "sem alteração detectada";
}

function short(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "string") return v.length > 40 ? v.slice(0, 37) + "…" : v;
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "true" : "false";
  return JSON.stringify(v).slice(0, 40);
}

const ENTITY_LABEL: Record<string, string> = {
  aporte: "Aporte",
  statement: "Lançamento",
  investor_profile: "Cadastro",
  user_login: "Acesso"
};

const ACTION_TONE: Record<string, "success" | "info" | "warning"> = {
  create: "success",
  update: "info",
  delete: "warning"
};

export function AuditClient({
  entries,
  investors
}: {
  entries: AuditLogEntry[];
  investors: InvestorOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function onFilter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next = new URLSearchParams();
    for (const k of ["investorId", "entity", "source", "actorId", "from", "to"] as const) {
      const v = fd.get(k);
      if (typeof v === "string" && v.trim() !== "") next.set(k, v.trim());
    }
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function clearFilters() {
    router.push(pathname);
  }

  function toggle(id: string) {
    setExpanded((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  const hasFilters = Array.from(params.keys()).length > 0;
  const investorById = new Map(investors.map((i) => [i.id, i.fullName]));

  return (
    <div className="space-y-6">
      <Card>
        <CardBody>
          <form
            onSubmit={onFilter}
            className="grid gap-4 md:grid-cols-3 lg:grid-cols-6"
          >
            <Field label="Investidor" htmlFor="aud-inv">
              <Select
                id="aud-inv"
                name="investorId"
                defaultValue={params.get("investorId") ?? ""}
              >
                <option value="">Todos</option>
                {investors.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.fullName}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Entidade" htmlFor="aud-ent">
              <Select
                id="aud-ent"
                name="entity"
                defaultValue={params.get("entity") ?? ""}
              >
                <option value="">Todas</option>
                <option value="aporte">Aporte</option>
                <option value="statement">Lançamento mensal</option>
                <option value="investor_profile">Cadastro</option>
                <option value="user_login">Acesso</option>
              </Select>
            </Field>
            <Field label="Origem" htmlFor="aud-src">
              <Select
                id="aud-src"
                name="source"
                defaultValue={params.get("source") ?? ""}
              >
                <option value="">Todas</option>
                <option value="ui">Interface</option>
                <option value="excel_upload">Upload Excel</option>
              </Select>
            </Field>
            <Field label="Ator (ID)" htmlFor="aud-act" hint="userId exato">
              <Input
                id="aud-act"
                name="actorId"
                defaultValue={params.get("actorId") ?? ""}
              />
            </Field>
            <Field label="De" htmlFor="aud-from">
              <Input
                id="aud-from"
                type="date"
                name="from"
                defaultValue={(params.get("from") ?? "").slice(0, 10)}
              />
            </Field>
            <Field label="Até" htmlFor="aud-to">
              <Input
                id="aud-to"
                type="date"
                name="to"
                defaultValue={(params.get("to") ?? "").slice(0, 10)}
              />
            </Field>
            <div className="md:col-span-3 lg:col-span-6 flex justify-end gap-2">
              {hasFilters ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                >
                  <FilterX className="h-4 w-4" /> Limpar
                </Button>
              ) : null}
              <Button type="submit" size="sm">
                <Search className="h-4 w-4" /> Aplicar filtros
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {entries.length === 0 ? (
        <Alert tone="info">
          Nenhuma entrada de auditoria encontrada para os filtros atuais.
        </Alert>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink-500 border-b border-ink-200">
                  <th className="px-3 py-2 font-medium w-8"></th>
                  <th className="px-3 py-2 font-medium">Quando</th>
                  <th className="px-3 py-2 font-medium">Ator</th>
                  <th className="px-3 py-2 font-medium">Ação</th>
                  <th className="px-3 py-2 font-medium">Entidade</th>
                  <th className="px-3 py-2 font-medium">Investidor</th>
                  <th className="px-3 py-2 font-medium">Resumo</th>
                  <th className="px-3 py-2 font-medium">Origem</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => {
                  const open = expanded.has(e.id);
                  return (
                    <Fragment key={e.id}>
                      <tr className="border-b last:border-b-0 border-ink-100 align-top">
                        <td className="px-3 py-2">
                          <button
                            onClick={() => toggle(e.id)}
                            className="text-ink-500 hover:text-ink-900"
                            aria-label="Expandir detalhes"
                          >
                            {open ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                        <td className="px-3 py-2 text-xs tabular-nums text-ink-600">
                          {new Date(e.timestamp).toLocaleString("pt-BR")}
                        </td>
                        <td className="px-3 py-2 text-ink-800">
                          <div>{e.actorName}</div>
                          <div className="text-xs text-ink-500">{e.actorId}</div>
                        </td>
                        <td className="px-3 py-2">
                          <Badge tone={ACTION_TONE[e.action]}>{e.action}</Badge>
                        </td>
                        <td className="px-3 py-2 text-ink-700">
                          {ENTITY_LABEL[e.entity] ?? e.entity}
                          <div className="text-xs text-ink-500">{e.entityId}</div>
                        </td>
                        <td className="px-3 py-2 text-ink-700">
                          {investorById.get(e.investorId) ?? e.investorId}
                        </td>
                        <td className="px-3 py-2 text-ink-700 max-w-[360px]">
                          {summarizeDiff(e.before, e.after)}
                        </td>
                        <td className="px-3 py-2">
                          <Badge tone={e.source === "ui" ? "neutral" : "info"}>
                            {e.source === "ui" ? "UI" : "Excel"}
                          </Badge>
                        </td>
                      </tr>
                      {open ? (
                        <tr className="border-b last:border-b-0 border-ink-100 bg-ink-50/40">
                          <td></td>
                          <td colSpan={7} className="px-3 py-3">
                            <div className="grid gap-4 md:grid-cols-2 text-xs font-mono">
                              <div>
                                <p className="mb-1 text-ink-500 uppercase tracking-wider">
                                  Antes
                                </p>
                                <pre className="rounded bg-white border border-ink-200 p-2 overflow-x-auto">
                                  {e.before
                                    ? JSON.stringify(e.before, null, 2)
                                    : "(nulo · criação)"}
                                </pre>
                              </div>
                              <div>
                                <p className="mb-1 text-ink-500 uppercase tracking-wider">
                                  Depois
                                </p>
                                <pre className="rounded bg-white border border-ink-200 p-2 overflow-x-auto">
                                  {e.after
                                    ? JSON.stringify(e.after, null, 2)
                                    : "(nulo · exclusão)"}
                                </pre>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
