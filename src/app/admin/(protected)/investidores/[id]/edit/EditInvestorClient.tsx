"use client";

import { useRouter } from "next/navigation";
import { InvestorForm } from "@/components/admin/InvestorForm";
import type { InvestorProfile } from "@/types/investorProfile";
import { investorsAdminService } from "@/services/investorsAdmin.service";

export function EditInvestorClient({ profile }: { profile: InvestorProfile }) {
  const router = useRouter();
  return (
    <InvestorForm
      defaultValues={profile}
      submitLabel="Salvar alterações"
      onSubmit={async (input) => {
        await investorsAdminService.update(profile.id, input);
        router.replace("/admin/investidores");
        router.refresh();
      }}
    />
  );
}
