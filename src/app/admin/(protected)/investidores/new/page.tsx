"use client";

import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { InvestorForm } from "@/components/admin/InvestorForm";
import { investorsAdminService } from "@/services/investorsAdmin.service";

export default function NewInvestorPage() {
  const router = useRouter();
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-ink-900 tracking-tight">
          Novo investidor
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Cadastre um investidor no portfólio da Byte7.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Cadastro</CardTitle>
        </CardHeader>
        <CardBody>
          <InvestorForm
            submitLabel="Criar cadastro"
            onSubmit={async (input) => {
              await investorsAdminService.create(input);
              router.replace("/admin/investidores");
              router.refresh();
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
}
