"use client";

import { useRouter } from "next/navigation";
import { PostForm } from "@/components/blog/PostForm";
import { blogService } from "@/services/blog.service";

export function NewPostClient({ basePath }: { basePath: string }) {
  const router = useRouter();
  return (
    <PostForm
      submitLabel="Criar post"
      onSubmit={async (input) => {
        await blogService.create(input);
        router.replace(`${basePath}/posts`);
        router.refresh();
      }}
    />
  );
}
