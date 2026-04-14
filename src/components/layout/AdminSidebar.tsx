"use client";

import { FileText, LayoutDashboard, PlusCircle } from "lucide-react";
import { AppSidebar } from "./AppSidebar";

export function AdminSidebar({ userName }: { userName: string }) {
  return (
    <AppSidebar
      title="Admin"
      userName={userName}
      onLogoutRedirect="/admin/login"
      items={[
        { href: "/admin", label: "Visão geral", icon: LayoutDashboard, match: "exact" },
        { href: "/admin/posts", label: "Posts", icon: FileText },
        { href: "/admin/posts/new", label: "Novo post", icon: PlusCircle, match: "exact" }
      ]}
    />
  );
}
