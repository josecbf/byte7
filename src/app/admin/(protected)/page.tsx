import Link from "next/link";
import { redirect } from "next/navigation";
import { PlusCircle, FileText, Eye } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { listPosts } from "@/mocks/posts";

export const dynamic = "force-dynamic";

export default function AdminOverviewPage() {
  const all = listPosts();
  const published = all.filter((p) => p.status === "published").length;
  const drafts = all.length - published;

  if (all.length === 0) {
    redirect("/admin/posts");
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-ink-900 tracking-tight">
          Visão geral
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Gerencie os posts do blog — demo mockada, persistência em memória.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total de posts" value={all.length} icon={FileText} />
        <Stat label="Publicados" value={published} icon={Eye} />
        <Stat label="Rascunhos" value={drafts} icon={FileText} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/posts/new">
          <Button>
            <PlusCircle className="h-4 w-4" /> Novo post
          </Button>
        </Link>
        <Link href="/admin/posts">
          <Button variant="outline">Gerenciar posts</Button>
        </Link>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardBody className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-ink-900">
            {value}
          </p>
        </div>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
          <Icon className="h-5 w-5" />
        </span>
      </CardBody>
    </Card>
  );
}
