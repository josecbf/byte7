import type { Contract } from "@/types/investor";
import { formatDate, formatPct } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Download } from "lucide-react";

export function ContractView({ contract }: { contract: Contract }) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Contrato {contract.number}</CardTitle>
          <p className="text-xs text-ink-500 mt-0.5">
            Assinado em {formatDate(contract.signedAt)} · Rendimento{" "}
            {formatPct(contract.monthlyYieldRate)} ao mês
          </p>
        </div>
        <a href={contract.downloadUrl} download>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Baixar contrato
          </Button>
        </a>
      </CardHeader>
      <CardBody className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wider text-ink-500">Investidor</p>
            <p className="text-ink-900 font-medium">{contract.parties.investor}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-ink-500">Emissor</p>
            <p className="text-ink-900 font-medium">{contract.parties.issuer}</p>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-ink-500 mb-2">Resumo</p>
          <p className="text-sm text-ink-700 leading-relaxed">{contract.summary}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-ink-500 mb-2">Cláusulas</p>
          <div className="space-y-4">
            {contract.clauses.map((c) => (
              <div key={c.title}>
                <p className="text-sm font-semibold text-ink-900">{c.title}</p>
                <p className="text-sm text-ink-700 leading-relaxed mt-1">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
