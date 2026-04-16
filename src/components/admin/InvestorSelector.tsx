"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ChangeEvent } from "react";
import { Select } from "@/components/ui/Select";

interface Option {
  id: string;
  fullName: string;
  status: string;
}

/**
 * Dropdown de filtro do dashboard admin. "all" → dados consolidados
 * de toda a base. Qualquer outro id → filtra pelo investidor escolhido.
 * O estado fica em `?investor=<id>` na URL para permitir refresh,
 * compartilhamento de link e navegação pelo browser (back/forward).
 */
export function InvestorSelector({ investors }: { investors: Option[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selected = searchParams.get("investor") ?? "all";

  function onChange(e: ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (id === "all") params.delete("investor");
    else params.set("investor", id);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <Select value={selected} onChange={onChange} className="min-w-[260px]">
      <option value="all">Consolidado · todos os investidores</option>
      {investors.map((i) => (
        <option key={i.id} value={i.id}>
          {i.fullName} · {i.status}
        </option>
      ))}
    </Select>
  );
}
