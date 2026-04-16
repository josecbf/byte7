import type { InvestorProfileStatus } from "@/types/investorProfile";
import { Badge } from "@/components/ui/Badge";

export function InvestorStatusBadge({ status }: { status: InvestorProfileStatus }) {
  if (status === "ativo") return <Badge tone="success">Ativo</Badge>;
  if (status === "pendente") return <Badge tone="warning">Pendente</Badge>;
  return <Badge tone="neutral">Inativo</Badge>;
}
