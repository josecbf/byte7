export type PostStatus = "published" | "draft";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage?: string;
  tags: string[];
  status: PostStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  publishedAt?: string; // ISO
}

export type BlogPostInput = Omit<
  BlogPost,
  "id" | "slug" | "createdAt" | "updatedAt" | "publishedAt"
> & {
  slug?: string;
};
