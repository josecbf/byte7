"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, PlusCircle, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import type { MonthlyStatement } from "@/types/statement";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Field } from "@/components/ui/Label";
import { formatBRL, formatDate, formatPct } from "@/lib/format";

const schema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Formato esperado: YYYY-MM."),
  invested: z
    .number({ invalid_type_error: "Valor numérico." })
    .min(0, "Deve ser ≥ 0."),
  ratePct: z
    .number({ invalid_type_error: "Valor numérico." })
    .min(-100, "Taxa muito baixa.")
    .max(100, "Taxa muito alta."),
  balance: z
    .number({ invalid_type_error: "Valor numérico." })
    .min(0, "Deve ser ≥ 0."),
  note: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function isActive(s: MonthlyStatement): boolean {
  return s.supersededBy === null && s.voidedAt === null;
}

export function StatementsSection({
  investorId,
  statements
}: {
  investorId: string;
  statements: MonthlyStatement[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<MonthlyStatement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      month: currentMonth(),
      invested: 0,
      ratePct: 6,
      balance: 0,
      note: ""
    }
  });

  useEffect(() => {
    if (editing) {
      reset({
        month: editing.month,
        invested: editing.invested,
        ratePct: editing.rate * 100,
        balance: editing.balance,
        note: editing.note ?? ""
      });
    } else {
      reset({
        month: currentMonth(),
        invested: 0,
        ratePct: 6,
        balance: 0,
        note: ""
      });
    }
  }, [editing, reset]);

  const activeStatements = statements.filter(isActive);

  const submit = handleSubmit(async (values) => {
    setError(null);
    const payload = {
      month: values.month,
      invested: Number(values.invested),
      rate: Number(values.ratePct) / 100,
      balance: Number(values.balance),
      note: values.note?.trim() || undefined
    };
    try {
      const res = await fetch(`/api/investors/${investorId}/statements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "Falha ao salvar lançamento.");
      }
      setEditing(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao salvar.");
    }
  });

  async function handleDelete(s: MonthlyStatement) {
    if (
      !confirm(
        `Invalidar o lançamento de ${s.month}? O registro permanece no banco para auditoria.`
      )
    )
      return;
    setBusy(s.id);
    setError(null);
    try {
      const res = await fetch(
        `/api/investors/${investorId}/statements/${s.id}`,
        { method: "DELETE" }
      );
      if (!res.ok && res.status !== 204) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "Falha ao invalidar lançamento.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao invalidar.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lançamentos mensais</CardTitle>
        <span className="text-xs text-ink-500">
          {activeStatements.length}{" "}
          {activeStatements.length === 1 ? "mês ativo" : "meses ativos"} ·
          sobrescreve o fallback de 6% a.m. · histórico preservado
        </span>
      </CardHeader>
      <CardBody className="space-y-5">
        {error ? <Alert tone="error">{error}</Alert> : null}

        <form
          onSubmit={submit}
          className="space-y-4 rounded-md border border-ink-200 bg-ink-50/60 p-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-ink-800">
              {editing
                ? `Corrigindo ${editing.month} — será criado um novo registro`
                : "Novo lançamento"}
            </p>
            {editing ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditing(null)}
              >
                <X className="h-4 w-4" /> Cancelar correção
              </Button>
            ) : null}
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Mês" htmlFor="stm-month" error={errors.month?.message}>
              <Input
                id="stm-month"
                type="month"
                invalid={!!errors.month}
                {...register("month")}
              />
            </Field>
            <Field
              label="Total investido (R$)"
              htmlFor="stm-invested"
              error={errors.invested?.message}
            >
              <Input
                id="stm-invested"
                type="number"
                step="0.01"
                min="0"
                invalid={!!errors.invested}
                {...register("invested", { valueAsNumber: true })}
              />
            </Field>
            <Field
              label="Taxa do mês (%)"
              htmlFor="stm-rate"
              error={errors.ratePct?.message}
              hint="Exibida ao investidor · ex.: 6 = 6%"
            >
              <Input
                id="stm-rate"
                type="number"
                step="0.01"
                invalid={!!errors.ratePct}
                {...register("ratePct", { valueAsNumber: true })}
              />
            </Field>
            <Field
              label="Saldo (R$)"
              htmlFor="stm-balance"
              error={errors.balance?.message}
            >
              <Input
                id="stm-balance"
                type="number"
                step="0.01"
                min="0"
                invalid={!!errors.balance}
                {...register("balance", { valueAsNumber: true })}
              />
            </Field>
          </div>
          <Field
            label="Observação"
            htmlFor="stm-note"
            hint="Opcional · aparece só no admin"
          >
            <Textarea id="stm-note" rows={2} {...register("note")} />
          </Field>
          <div className="flex justify-end">
            <Button type="submit" size="sm" loading={isSubmitting}>
              {editing ? (
                <>
                  <Pencil className="h-4 w-4" /> Registrar correção
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" /> Adicionar lançamento
                </>
              )}
            </Button>
          </div>
        </form>

        {statements.length === 0 ? (
          <p className="text-sm text-ink-500">
            Nenhum lançamento registrado. Enquanto não houver, o dashboard
            calcula automaticamente com 6% ao mês sobre os aportes.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink-500 border-b border-ink-200">
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Mês</th>
                  <th className="px-3 py-2 font-medium text-right">Investido</th>
                  <th className="px-3 py-2 font-medium text-right">Taxa</th>
                  <th className="px-3 py-2 font-medium text-right">Saldo</th>
                  <th className="px-3 py-2 font-medium">Obs.</th>
                  <th className="px-3 py-2 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {statements.map((s) => {
                  const active = isActive(s);
                  const superseded = s.supersededBy !== null;
                  const voided = s.voidedAt !== null;
                  const rowCls = active ? "" : "bg-ink-50/50 text-ink-500";
                  return (
                    <tr
                      key={s.id}
                      className={`border-b last:border-b-0 border-ink-100 ${rowCls}`}
                    >
                      <td className="px-3 py-2">
                        {active ? (
                          <Badge tone="success">Ativo</Badge>
                        ) : superseded ? (
                          <Badge tone="neutral">Substituído</Badge>
                        ) : voided ? (
                          <Badge tone="warning">Invalidado</Badge>
                        ) : null}
                        {!active ? (
                          <div className="mt-1 text-[10px] text-ink-500">
                            {superseded
                              ? `→ ${s.supersededBy}`
                              : `em ${formatDate(s.voidedAt!)}`}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-3 py-2 font-medium">{s.month}</td>
                      <td
                        className={`px-3 py-2 text-right tabular-nums ${!active ? "line-through" : ""}`}
                      >
                        {formatBRL(s.invested)}
                      </td>
                      <td
                        className={`px-3 py-2 text-right tabular-nums ${!active ? "line-through" : ""}`}
                      >
                        {formatPct(s.rate)}
                      </td>
                      <td
                        className={`px-3 py-2 text-right tabular-nums ${
                          active
                            ? "font-medium text-brand-700"
                            : "line-through"
                        }`}
                      >
                        {formatBRL(s.balance)}
                      </td>
                      <td className="px-3 py-2 text-xs max-w-[220px] truncate">
                        {s.note ?? "—"}
                      </td>
                      <td className="px-3 py-2">
                        {active ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditing(s)}
                            >
                              <Pencil className="h-4 w-4" /> Corrigir
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              loading={busy === s.id}
                              onClick={() => handleDelete(s)}
                            >
                              <Trash2 className="h-4 w-4" /> Invalidar
                            </Button>
                          </div>
                        ) : (
                          <div className="text-right text-[10px] text-ink-400">
                            —
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
