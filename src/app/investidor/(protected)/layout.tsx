import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, decodeSession, matchesRole } from "@/lib/session";
import { InvestorSidebar } from "@/components/layout/InvestorSidebar";
import { MobileTopbar } from "@/components/layout/MobileTopbar";

export default function InvestorProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (!matchesRole(session, "investor")) {
    redirect("/investidor/login");
  }
  return (
    <div className="min-h-screen flex bg-ink-50">
      <InvestorSidebar userName={session!.name} />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileTopbar userName={session!.name} onLogoutRedirect="/investidor/login" />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
