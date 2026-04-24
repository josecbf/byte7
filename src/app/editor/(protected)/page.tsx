import Link from "next/link";
import { Eye, FileText, PlusCircle } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { listPosts } from "@/mocks/posts";

export const dynamic = "force-dynamic";

export default function EditorOverviewPage() {
  const posts = listPosts();
  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.length - published;

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-ink-900 tracking-tight">
          Visão geral
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Edição de conteúdo do blog.
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-sm uppercase tracking-wider text-ink-500">
              Blog
            </h2>
            <p className="text-xs text-ink-500">
              {posts.length} posts · {published} publicados · {drafts} rascunhos
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/editor/posts/new">
              <Button size="sm">
                <PlusCircle className="h-4 w-4" /> Novo post
              </Button>
            </Link>
            <Link href="/editor/posts">
              <Button variant="outline" size="sm">
                Gerenciar
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Total de posts" value={posts.length} icon={FileText} />
          <Stat label="Publicados" value={published} icon={Eye} />
          <Stat label="Rascunhos" value={drafts} icon={FileText} />
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon
}: {
  label: string;
  value: number | string;
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
