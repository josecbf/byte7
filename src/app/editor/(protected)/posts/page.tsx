import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { listPosts } from "@/mocks/posts";
import { PostsTable } from "@/components/blog/PostsTable";

export const dynamic = "force-dynamic";

export default function EditorPostsPage() {
  const posts = listPosts();
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 tracking-tight">
            Posts do blog
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Liste, edite ou exclua os posts existentes. Crie novos posts a partir daqui.
          </p>
        </div>
        <Link href="/editor/posts/new">
          <Button>
            <PlusCircle className="h-4 w-4" /> Novo post
          </Button>
        </Link>
      </div>

      <Card>
        <PostsTable posts={posts} basePath="/editor" />
      </Card>
    </div>
  );
}
