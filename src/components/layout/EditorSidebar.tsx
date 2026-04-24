"use client";

import { FileText, LayoutDashboard, PlusCircle } from "lucide-react";
import { AppSidebar } from "./AppSidebar";

export function EditorSidebar({ userName }: { userName: string }) {
  return (
    <AppSidebar
      title="Editor"
      userName={userName}
      onLogoutRedirect="/editor/login"
      items={[
        { href: "/editor", label: "Visão geral", icon: LayoutDashboard, match: "exact" },
        { href: "/editor/posts", label: "Posts", icon: FileText },
        { href: "/editor/posts/new", label: "Novo post", icon: PlusCircle, match: "exact" }
      ]}
    />
  );
}
