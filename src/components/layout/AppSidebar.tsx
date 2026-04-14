"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";
import { LogOut } from "lucide-react";
import { authService } from "@/services/auth.service";
import type { ComponentType, SVGProps } from "react";

export interface SidebarItem {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  match?: "prefix" | "exact";
}

export function AppSidebar({
  title,
  userName,
  items,
  onLogoutRedirect
}: {
  title: string;
  userName: string;
  items: SidebarItem[];
  onLogoutRedirect: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await authService.logout().catch(() => null);
    router.replace(onLogoutRedirect);
    router.refresh();
  }

  return (
    <aside className="hidden md:flex md:w-64 md:shrink-0 flex-col border-r border-ink-200 bg-white">
      <div className="px-5 py-5 border-b border-ink-200">
        <Logo showTag />
        <p className="mt-3 text-xs uppercase tracking-wider text-ink-500">
          {title}
        </p>
        <p className="text-sm font-medium text-ink-900 truncate">{userName}</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map((it) => {
          const active =
            it.match === "exact"
              ? pathname === it.href
              : pathname === it.href || pathname.startsWith(it.href + "/");
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-50 text-brand-800"
                  : "text-ink-700 hover:bg-ink-100"
              )}
            >
              <Icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-ink-200">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start"
        >
          <LogOut className="h-4 w-4" /> Sair
        </Button>
      </div>
    </aside>
  );
}
