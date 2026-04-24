import Link from "next/link";
import { Wallet } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { getInvestorById } from "@/mocks/investorProfiles";
import { getUserByInvestorProfileId, toPublicUser } from "@/mocks/users";
import { EditInvestorClient } from "./EditInvestorClient";
import { LoginSection } from "./LoginSection";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default function EditInvestorPage({
  params
}: {
  params: { id: string };
}) {
  const profile = getInvestorById(params.id);
  if (!profile) notFound();

  const existingUser = getUserByInvestorProfileId(profile.id);
  const login = existingUser ? toPublicUser(existingUser) : null;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 tracking-tight">
            Editar investidor
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Cadastrado em {formatDate(profile.createdAt)} · atualizado em{" "}
            {formatDate(profile.updatedAt)}.
          </p>
        </div>
        <Link href={`/admin/investidores/${profile.id}/financeiro`}>
          <Button variant="outline" size="sm">
            <Wallet className="h-4 w-4" /> Financeiro
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Cadastro</CardTitle>
        </CardHeader>
        <CardBody>
          <EditInvestorClient profile={profile} />
        </CardBody>
      </Card>

      <LoginSection
        investorId={profile.id}
        profileFullName={profile.fullName}
        profileEmail={profile.email}
        login={
          login
            ? { id: login.id, name: login.name, email: login.email }
            : null
        }
      />
    </div>
  );
}
