"use client";

import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { PostForm } from "@/components/blog/PostForm";
import { blogService } from "@/services/blog.service";

export default function NewPostPage() {
  const router = useRouter();
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-ink-900 tracking-tight">
          Novo post
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Preencha os dados. Rascunhos não aparecem no blog público.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Conteúdo</CardTitle>
        </CardHeader>
        <CardBody>
          <PostForm
            submitLabel="Criar post"
            onSubmit={async (input) => {
              await blogService.create(input);
              router.replace("/admin/posts");
              router.refresh();
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
}
