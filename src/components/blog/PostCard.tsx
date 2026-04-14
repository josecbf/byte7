import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/types/blog";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";

export function PostCard({ post }: { post: BlogPost }) {
  const date = post.publishedAt ?? post.updatedAt;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-ink-200 bg-white shadow-card transition hover:shadow-md"
    >
      {post.coverImage ? (
        <div className="relative aspect-[16/9] w-full bg-ink-100">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition group-hover:scale-[1.02]"
          />
        </div>
      ) : (
        <div className="aspect-[16/9] w-full bg-gradient-to-br from-brand-100 to-brand-200" />
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-ink-500">
          <span>{formatDate(date)}</span>
          <span>·</span>
          <span>{post.author}</span>
        </div>
        <h3 className="mt-2 text-lg font-semibold text-ink-900 group-hover:text-brand-700">
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-ink-600 line-clamp-3">{post.excerpt}</p>
        {post.tags.length ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((t) => (
              <Badge key={t} tone="brand">
                {t}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
