"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import type { BlogPost } from "@/types/blog";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/format";
import { blogService } from "@/services/blog.service";

export function AdminPostsTable({ posts }: { posts: BlogPost[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Excluir "${title}"? Esta ação não pode ser desfeita.`)) return;
    setError(null);
    setDeleting(id);
    try {
      await blogService.remove(id);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao excluir.");
    } finally {
      setDeleting(null);
    }
  }

  if (posts.length === 0) {
    return (
      <div className="p-10 text-center text-sm text-ink-600">
        Nenhum post ainda.{" "}
        <Link href="/admin/posts/new" className="text-brand-700 underline">
          Crie o primeiro
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {error ? (
        <div className="m-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      ) : null}
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-ink-500 border-b border-ink-200">
            <th className="px-4 py-3 font-medium">Título</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Atualizado</th>
            <th className="px-4 py-3 font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.id} className="border-b last:border-b-0 border-ink-100">
              <td className="px-4 py-3">
                <div className="font-medium text-ink-900">{p.title}</div>
                <div className="text-xs text-ink-500">/{p.slug}</div>
              </td>
              <td className="px-4 py-3">
                {p.status === "published" ? (
                  <Badge tone="success">Publicado</Badge>
                ) : (
                  <Badge tone="warning">Rascunho</Badge>
                )}
              </td>
              <td className="px-4 py-3 text-ink-600">
                {formatDate(p.updatedAt)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1.5">
                  {p.status === "published" ? (
                    <Link href={`/blog/${p.slug}`} target="_blank">
                      <Button variant="ghost" size="sm" aria-label="Abrir no blog">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  ) : null}
                  <Link href={`/admin/posts/${p.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    loading={deleting === p.id}
                    onClick={() => handleDelete(p.id, p.title)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
