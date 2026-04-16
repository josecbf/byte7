"use client";

import {
  BarChart3,
  FileText,
  LayoutDashboard,
  PlusCircle,
  Users
} from "lucide-react";
import { AppSidebar } from "./AppSidebar";

export function AdminSidebar({ userName }: { userName: string }) {
  return (
    <AppSidebar
      title="Admin"
      userName={userName}
      onLogoutRedirect="/admin/login"
      items={[
        { href: "/admin", label: "Visão geral", icon: LayoutDashboard, match: "exact" },
        { href: "/admin/dashboard", label: "Resultados", icon: BarChart3 },
        { href: "/admin/investidores", label: "Investidores", icon: Users },
        { href: "/admin/posts", label: "Posts", icon: FileText },
        { href: "/admin/posts/new", label: "Novo post", icon: PlusCircle, match: "exact" }
      ]}
    />
  );
}
