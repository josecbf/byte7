"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2, Wallet } from "lucide-react";
import type { InvestorProfile } from "@/types/investorProfile";
import { Button } from "@/components/ui/Button";
import { InvestorStatusBadge } from "@/components/investor/InvestorStatusBadge";
import { formatDate } from "@/lib/format";
import { investorsAdminService } from "@/services/investorsAdmin.service";

export function AdminInvestorsTable({
  investors
}: {
  investors: InvestorProfile[];
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Excluir cadastro de "${name}"?`)) return;
    setError(null);
    setDeleting(id);
    try {
      await investorsAdminService.remove(id);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao excluir.");
    } finally {
      setDeleting(null);
    }
  }

  if (investors.length === 0) {
    return (
      <div className="p-10 text-center text-sm text-ink-600">
        Nenhum cadastro ainda.{" "}
        <Link href="/admin/investidores/new" className="text-brand-700 underline">
          Crie o primeiro
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {error ? (
        <div className="m-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      ) : null}
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-ink-500 border-b border-ink-200">
            <th className="px-4 py-3 font-medium">Investidor</th>
            <th className="px-4 py-3 font-medium">Documento</th>
            <th className="px-4 py-3 font-medium">Cidade/UF</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Atualizado</th>
            <th className="px-4 py-3 font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {investors.map((i) => (
            <tr key={i.id} className="border-b last:border-b-0 border-ink-100">
              <td className="px-4 py-3">
                <div className="font-medium text-ink-900">{i.fullName}</div>
                <div className="text-xs text-ink-500">{i.email}</div>
              </td>
              <td className="px-4 py-3 text-ink-700 tabular-nums">{i.document}</td>
              <td className="px-4 py-3 text-ink-700">
                {i.city}/{i.state}
              </td>
              <td className="px-4 py-3">
                <InvestorStatusBadge status={i.status} />
              </td>
              <td className="px-4 py-3 text-ink-600">{formatDate(i.updatedAt)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1.5">
                  <Link href={`/admin/investidores/${i.id}/financeiro`}>
                    <Button variant="outline" size="sm">
                      <Wallet className="h-4 w-4" />
                      Financeiro
                    </Button>
                  </Link>
                  <Link href={`/admin/investidores/${i.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    loading={deleting === i.id}
                    onClick={() => handleDelete(i.id, i.fullName)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
