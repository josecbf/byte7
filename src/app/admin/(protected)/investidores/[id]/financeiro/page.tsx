import Link from "next/link";
import { ArrowLeft, ClipboardList, Pencil, ShieldAlert } from "lucide-react";
import { notFound } from "next/navigation";

import { getInvestorById } from "@/mocks/investorProfiles";
import { listAportes } from "@/mocks/aportes";
import { listStatements } from "@/mocks/statements";
import { MOCK_USINAS } from "@/mocks/usinas";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { InvestorStatusBadge } from "@/components/investor/InvestorStatusBadge";
import { AportesSection } from "./AportesSection";
import { StatementsSection } from "./StatementsSection";

export const dynamic = "force-dynamic";

export default function InvestorFinancialPage({
  params
}: {
  params: { id: string };
}) {
  const investor = getInvestorById(params.id);
  if (!investor) notFound();

  // Admin vê tudo — inclusive superseded/voided. O investidor só vê ativos.
  const aportes = listAportes({
    investorId: params.id,
    includeInactive: true
  });
  const statements = listStatements({
    investorId: params.id,
    includeInactive: true
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-2">
          <Link
            href="/admin/investidores"
            className="inline-flex items-center gap-1 text-xs text-ink-500 hover:text-brand-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Investidores
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-ink-900 tracking-tight">
              Financeiro · {investor.fullName}
            </h1>
            <InvestorStatusBadge status={investor.status} />
          </div>
          <p className="text-sm text-ink-500">
            {investor.email} · {investor.document} · {investor.city}/
            {investor.state}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/investidores/${investor.id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="h-4 w-4" /> Editar cadastro
            </Button>
          </Link>
          <Link href={`/admin/auditoria?investorId=${investor.id}`}>
            <Button variant="outline" size="sm">
              <ClipboardList className="h-4 w-4" /> Auditoria deste investidor
            </Button>
          </Link>
        </div>
      </div>

      <Alert tone="info">
        <div className="flex gap-2 items-start">
          <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" />
          <div className="text-sm">
            <strong>Entradas operacionais · demo.</strong> Esta tela registra
            dados que o investidor enxerga no portal — sem movimentação
            financeira real. Toda criação, edição e exclusão fica registrada em{" "}
            <Link
              href="/admin/auditoria"
              className="underline hover:text-brand-700"
            >
              Auditoria
            </Link>
            .
          </div>
        </div>
      </Alert>

      <AportesSection
        investorId={investor.id}
        aportes={aportes}
        usinas={MOCK_USINAS}
      />

      <StatementsSection
        investorId={investor.id}
        statements={statements}
      />
    </div>
  );
}
