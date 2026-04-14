import type { Usina } from "@/types/investor";
import { Badge } from "@/components/ui/Badge";

export function UsinaStatusBadge({ status }: { status: Usina["status"] }) {
  if (status === "operando") return <Badge tone="success">Operando</Badge>;
  if (status === "construcao") return <Badge tone="warning">Em construção</Badge>;
  return <Badge tone="info">Planejada</Badge>;
}
