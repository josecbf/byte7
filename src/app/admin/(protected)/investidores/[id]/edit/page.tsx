import { notFound } from "next/navigation";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { getInvestorById } from "@/mocks/investorProfiles";
import { EditInvestorClient } from "./EditInvestorClient";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default function EditInvestorPage({
  params
}: {
  params: { id: string };
}) {
  const profile = getInvestorById(params.id);
  if (!profile) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-ink-900 tracking-tight">
          Editar investidor
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Cadastrado em {formatDate(profile.createdAt)} · atualizado em{" "}
          {formatDate(profile.updatedAt)}.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Cadastro</CardTitle>
        </CardHeader>
        <CardBody>
          <EditInvestorClient profile={profile} />
        </CardBody>
      </Card>
    </div>
  );
}
