"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, PlusCircle, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import type { Aporte, Usina } from "@/types/investor";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Field } from "@/components/ui/Label";
import { formatBRL, formatDate } from "@/lib/format";

const schema = z.object({
  date: z.string().min(1, "Informe a data."),
  amount: z
    .number({ invalid_type_error: "Valor numérico." })
    .positive("Valor deve ser positivo."),
  usinaId: z.string().min(1, "Selecione a usina."),
  reference: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

function isActive(a: Aporte): boolean {
  return a.supersededBy === null && a.voidedAt === null;
}

export function AportesSection({
  investorId,
  aportes,
  usinas
}: {
  investorId: string;
  aportes: Aporte[];
  usinas: Usina[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Aporte | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const defaultUsinaId = useMemo(() => usinas[0]?.id ?? "", [usinas]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      amount: 0,
      usinaId: defaultUsinaId,
      reference: ""
    }
  });

  useEffect(() => {
    if (editing) {
      reset({
        date: editing.date,
        amount: editing.amount,
        usinaId: editing.usinaId,
        reference: editing.reference
      });
    } else {
      reset({
        date: new Date().toISOString().slice(0, 10),
        amount: 0,
        usinaId: defaultUsinaId,
        reference: ""
      });
    }
  }, [editing, reset, defaultUsinaId]);

  const activeAportes = aportes.filter(isActive);
  const activeTotal = activeAportes.reduce((s, a) => s + a.amount, 0);

  const submit = handleSubmit(async (values) => {
    setError(null);
    const usina = usinas.find((u) => u.id === values.usinaId);
    const payload = {
      date: values.date,
      amount: Number(values.amount),
      usinaId: values.usinaId,
      usinaName: usina?.name ?? "",
      reference: values.reference?.trim() || undefined,
      ...(editing ? { supersedes: editing.id } : {})
    };
    try {
      const res = await fetch(`/api/investors/${investorId}/aportes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "Falha ao salvar aporte.");
      }
      setEditing(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao salvar.");
    }
  });

  async function handleDelete(a: Aporte) {
    if (
      !confirm(
        `Invalidar o aporte ${a.reference} de ${formatBRL(a.amount)}? O registro permanece no banco para auditoria.`
      )
    )
      return;
    setBusy(a.id);
    setError(null);
    try {
      const res = await fetch(
        `/api/investors/${investorId}/aportes/${a.id}`,
        { method: "DELETE" }
      );
      if (!res.ok && res.status !== 204) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "Falha ao invalidar aporte.");
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
        <CardTitle>Aportes</CardTitle>
        <span className="text-xs text-ink-500">
          {activeAportes.length}{" "}
          {activeAportes.length === 1 ? "ativo" : "ativos"} ·{" "}
          {formatBRL(activeTotal)} · histórico preservado no banco
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
                ? `Corrigindo ${editing.reference} — será criado um novo registro`
                : "Novo aporte"}
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
            <Field label="Data" htmlFor="apt-date" error={errors.date?.message}>
              <Input
                id="apt-date"
                type="date"
                invalid={!!errors.date}
                {...register("date")}
              />
            </Field>
            <Field
              label="Valor (R$)"
              htmlFor="apt-amount"
              error={errors.amount?.message}
            >
              <Input
                id="apt-amount"
                type="number"
                step="0.01"
                min="0"
                invalid={!!errors.amount}
                {...register("amount", { valueAsNumber: true })}
              />
            </Field>
            <Field
              label="Usina"
              htmlFor="apt-usina"
              error={errors.usinaId?.message}
            >
              <Select id="apt-usina" {...register("usinaId")}>
                {usinas.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field
              label="Referência"
              htmlFor="apt-ref"
              hint="Opcional · gerada se vazia"
            >
              <Input id="apt-ref" {...register("reference")} />
            </Field>
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="sm" loading={isSubmitting}>
              {editing ? (
                <>
                  <Pencil className="h-4 w-4" /> Registrar correção
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" /> Adicionar aporte
                </>
              )}
            </Button>
          </div>
        </form>

        {aportes.length === 0 ? (
          <p className="text-sm text-ink-500">Nenhum aporte registrado ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink-500 border-b border-ink-200">
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Data</th>
                  <th className="px-3 py-2 font-medium text-right">Valor</th>
                  <th className="px-3 py-2 font-medium">Usina</th>
                  <th className="px-3 py-2 font-medium">Referência</th>
                  <th className="px-3 py-2 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {aportes.map((a) => {
                  const active = isActive(a);
                  const superseded = a.supersededBy !== null;
                  const voided = a.voidedAt !== null;
                  const rowCls = active
                    ? ""
                    : "bg-ink-50/50 text-ink-500";
                  return (
                    <tr
                      key={a.id}
                      className={`border-b last:border-b-0 border-ink-100 ${rowCls}`}
                    >
                      <td className="px-3 py-2">
                        {active ? (
                          <Badge tone="success">Ativo</Badge>
                        ) : superseded ? (
                          <Badge tone="neutral">
                            Substituído
                          </Badge>
                        ) : voided ? (
                          <Badge tone="warning">Invalidado</Badge>
                        ) : null}
                        {!active ? (
                          <div className="mt-1 text-[10px] text-ink-500">
                            {superseded
                              ? `→ ${a.supersededBy}`
                              : `em ${formatDate(a.voidedAt!)}`}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-3 py-2">{formatDate(a.date)}</td>
                      <td
                        className={`px-3 py-2 text-right tabular-nums ${active ? "font-medium text-ink-900" : "line-through"}`}
                      >
                        {formatBRL(a.amount)}
                      </td>
                      <td className="px-3 py-2">{a.usinaName}</td>
                      <td className="px-3 py-2 text-xs">{a.reference}</td>
                      <td className="px-3 py-2">
                        {active ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditing(a)}
                            >
                              <Pencil className="h-4 w-4" /> Corrigir
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              loading={busy === a.id}
                              onClick={() => handleDelete(a)}
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
