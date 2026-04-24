import { notFound } from "next/navigation";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { getPostById } from "@/mocks/posts";
import { EditPostClient } from "@/components/blog/EditPostClient";

export const dynamic = "force-dynamic";

export default function EditPostPage({
  params
}: {
  params: { id: string };
}) {
  const post = getPostById(params.id);
  if (!post) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-ink-900 tracking-tight">
          Editar post
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Alterações são salvas no mesmo registro. Para publicar, mude o status.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Conteúdo</CardTitle>
        </CardHeader>
        <CardBody>
          <EditPostClient post={post} basePath="/editor" />
        </CardBody>
      </Card>
    </div>
  );
}
