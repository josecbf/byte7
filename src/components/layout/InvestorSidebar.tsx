"use client";

import { FileText, LayoutDashboard, Map, Wallet } from "lucide-react";
import { AppSidebar } from "./AppSidebar";

export function InvestorSidebar({ userName }: { userName: string }) {
  return (
    <AppSidebar
      title="Portal do investidor"
      userName={userName}
      onLogoutRedirect="/investidor/login"
      items={[
        { href: "/investidor", label: "Dashboard", icon: LayoutDashboard, match: "exact" },
        { href: "/investidor/aportes", label: "Aportes", icon: Wallet },
        { href: "/investidor/usinas", label: "Usinas", icon: Map },
        { href: "/investidor/contrato", label: "Contrato", icon: FileText }
      ]}
    />
  );
}
