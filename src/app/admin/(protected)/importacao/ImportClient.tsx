"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, FileSpreadsheet, Upload } from "lucide-react";

import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";

interface RowOutcome {
  rowNumber: number;
  investorId: string;
  month: string;
  outcome: "created" | "superseded" | "unchanged" | "error";
  message?: string;
  newStatementId?: string;
  supersededStatementId?: string;
}

interface ImportSummary {
  total: number;
  created: number;
  superseded: number;
  unchanged: number;
  errors: number;
  outcomes: RowOutcome[];
  parseErrors: { rowNumber: number; reason: string }[];
}

const OUTCOME_TONE: Record<RowOutcome["outcome"], "success" | "info" | "neutral" | "warning"> = {
  created: "success",
  superseded: "info",
  unchanged: "neutral",
  error: "warning"
};

const OUTCOME_LABEL: Record<RowOutcome["outcome"], string> = {
  created: "Criado",
  superseded: "Substituído",
  unchanged: "Inalterado",
  error: "Erro"
};

export function ImportClient() {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [busy, setBusy] = useState<"none" | "uploading">("none");
  const [error, setError] = useState<string | null>(null);

  async function submitUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = fileInput.current?.files?.[0];
    if (!file) {
      setError("Selecione um arquivo .xlsx para importar.");
      return;
    }
    setBusy("uploading");
    setError(null);
    setSummary(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/statements/import", {
        method: "POST",
        body: fd
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "Falha ao importar.");
      }
      const body = (await res.json()) as ImportSummary;
      setSummary(body);
      if (fileInput.current) fileInput.current.value = "";
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao importar.");
    } finally {
      setBusy("none");
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Exportar</CardTitle>
            <span className="text-xs text-ink-500">
              Baixa um .xlsx com todos os lançamentos ATIVOS. Cada linha
              é um par (investidor, mês).
            </span>
          </CardHeader>
          <CardBody>
            <a href="/api/admin/statements/export" download>
              <Button size="sm" className="w-full justify-center">
                <Download className="h-4 w-4" /> Baixar Excel
              </Button>
            </a>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Importar</CardTitle>
            <span className="text-xs text-ink-500">
              Envia o .xlsx corrigido. Linhas com novos valores criam um
              novo lançamento; linhas iguais são ignoradas; linhas com
              outros valores para o mesmo mês substituem (supersede) o
              ativo. Auditoria com origem <code>excel_upload</code>.
            </span>
          </CardHeader>
          <CardBody>
            <form onSubmit={submitUpload} className="space-y-3">
              <input
                ref={fileInput}
                type="file"
                accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className="block w-full text-sm file:mr-3 file:rounded-md file:border file:border-ink-200 file:bg-white file:px-3 file:py-1.5 file:text-sm file:text-ink-800 hover:file:bg-ink-50"
              />
              <Button
                type="submit"
                size="sm"
                className="w-full justify-center"
                loading={busy === "uploading"}
              >
                <Upload className="h-4 w-4" /> Enviar e aplicar
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>

      {error ? <Alert tone="error">{error}</Alert> : null}

      {summary ? (
        <Card>
          <CardHeader>
            <CardTitle>Resultado da importação</CardTitle>
            <span className="text-xs text-ink-500">
              {summary.total} linha(s) processada(s)
            </span>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-4">
              <StatChip label="Criados" value={summary.created} tone="success" />
              <StatChip
                label="Substituídos"
                value={summary.superseded}
                tone="info"
              />
              <StatChip
                label="Inalterados"
                value={summary.unchanged}
                tone="neutral"
              />
              <StatChip
                label="Erros"
                value={summary.errors}
                tone={summary.errors > 0 ? "warning" : "neutral"}
              />
            </div>

            {summary.parseErrors.length > 0 ? (
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-500 mb-2">
                  Erros de parsing ({summary.parseErrors.length})
                </p>
                <ul className="space-y-1 text-sm">
                  {summary.parseErrors.map((e, i) => (
                    <li key={i} className="text-amber-700">
                      L{e.rowNumber}: {e.reason}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {summary.outcomes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-ink-500 border-b border-ink-200">
                      <th className="px-3 py-2 font-medium">Linha</th>
                      <th className="px-3 py-2 font-medium">Investidor</th>
                      <th className="px-3 py-2 font-medium">Mês</th>
                      <th className="px-3 py-2 font-medium">Resultado</th>
                      <th className="px-3 py-2 font-medium">Detalhe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.outcomes.map((o) => (
                      <tr
                        key={`${o.rowNumber}-${o.investorId}-${o.month}`}
                        className="border-b last:border-b-0 border-ink-100"
                      >
                        <td className="px-3 py-2 tabular-nums">
                          {o.rowNumber}
                        </td>
                        <td className="px-3 py-2 text-xs">{o.investorId}</td>
                        <td className="px-3 py-2">{o.month}</td>
                        <td className="px-3 py-2">
                          <Badge tone={OUTCOME_TONE[o.outcome]}>
                            {OUTCOME_LABEL[o.outcome]}
                          </Badge>
                        </td>
                        <td className="px-3 py-2 text-xs text-ink-600">
                          {o.message ??
                            (o.supersededStatementId
                              ? `→ ${o.newStatementId} (antigo ${o.supersededStatementId})`
                              : o.newStatementId
                              ? `→ ${o.newStatementId}`
                              : "—")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="flex items-start gap-3 text-sm text-ink-600">
            <FileSpreadsheet className="h-5 w-5 text-ink-400 mt-0.5" />
            <div className="space-y-1">
              <p>
                Fluxo sugerido: baixe o Excel, ajuste ou adicione linhas
                com os meses novos (formato <code>YYYY-MM</code>) e
                envie de volta.
              </p>
              <p className="text-xs text-ink-500">
                Colunas esperadas (na ordem): <strong>ID Investidor</strong>,
                Investidor, Mês, Investido, Taxa do mês (%), Saldo, Observação.
                Apenas ID, Mês, Investido, Taxa e Saldo são obrigatórios —
                as demais são informativas.
              </p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

function StatChip({
  label,
  value,
  tone
}: {
  label: string;
  value: number;
  tone: "success" | "info" | "neutral" | "warning";
}) {
  const toneCls: Record<typeof tone, string> = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    info: "bg-sky-50 text-sky-700 border-sky-200",
    neutral: "bg-ink-50 text-ink-700 border-ink-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200"
  };
  return (
    <div className={`rounded-md border px-3 py-2 ${toneCls[tone]}`}>
      <p className="text-xs uppercase tracking-wider">{label}</p>
      <p className="text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
