"use client";

import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { LogOut } from "lucide-react";
import { authService } from "@/services/auth.service";

export function MobileTopbar({
  userName,
  onLogoutRedirect
}: {
  userName: string;
  onLogoutRedirect: string;
}) {
  const router = useRouter();
  async function handleLogout() {
    await authService.logout().catch(() => null);
    router.replace(onLogoutRedirect);
    router.refresh();
  }
  return (
    <div className="md:hidden sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-ink-200 bg-white px-4">
      <Logo showTag />
      <div className="flex items-center gap-2">
        <span className="text-xs text-ink-500 truncate max-w-[120px]">
          {userName}
        </span>
        <Button variant="ghost" size="sm" onClick={handleLogout} aria-label="Sair">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
