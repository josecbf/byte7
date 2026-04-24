import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { ImportClient } from "./ImportClient";

export const dynamic = "force-dynamic";

export default function ImportacaoPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 tracking-tight">
            Importação Excel
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Baixe e envie o arquivo consolidado de lançamentos mensais.
            Toda mudança aplicada fica rastreada em auditoria com origem
            <code className="ml-1">excel_upload</code>.
          </p>
        </div>
        <Link href="/admin/auditoria?source=excel_upload">
          <Button variant="outline" size="sm">
            <ClipboardList className="h-4 w-4" /> Auditoria de imports
          </Button>
        </Link>
      </div>

      <Alert tone="info">
        <div className="text-sm">
          O arquivo trata apenas de <strong>lançamentos mensais</strong>
          (rentabilidade/posição por mês). Aportes continuam sendo
          gerenciados pela tela de cada investidor em
          <code className="mx-1">/admin/investidores/[id]/financeiro</code>.
        </div>
      </Alert>

      <ImportClient />
    </div>
  );
}
