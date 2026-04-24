"use client";

import { useRouter } from "next/navigation";
import { PostForm } from "@/components/blog/PostForm";
import type { BlogPost } from "@/types/blog";
import { blogService } from "@/services/blog.service";

export function EditPostClient({
  post,
  basePath
}: {
  post: BlogPost;
  basePath: string;
}) {
  const router = useRouter();
  return (
    <PostForm
      defaultValues={post}
      submitLabel="Salvar alterações"
      onSubmit={async (input) => {
        await blogService.update(post.id, input);
        router.replace(`${basePath}/posts`);
        router.refresh();
      }}
    />
  );
}
