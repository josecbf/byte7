import type { BlogPost, BlogPostInput, PostStatus } from "@/types/blog";
import { apiRequest } from "./api-client";

export const blogService = {
  list(filter?: { status?: PostStatus }): Promise<BlogPost[]> {
    const qs = filter?.status ? `?status=${filter.status}` : "";
    return apiRequest<BlogPost[]>(`/api/posts${qs}`);
  },
  getBySlug(slug: string): Promise<BlogPost> {
    return apiRequest<BlogPost>(`/api/posts/by-slug/${encodeURIComponent(slug)}`);
  },
  getById(id: string): Promise<BlogPost> {
    return apiRequest<BlogPost>(`/api/posts/${encodeURIComponent(id)}`);
  },
  create(input: BlogPostInput): Promise<BlogPost> {
    return apiRequest<BlogPost>(`/api/posts`, {
      method: "POST",
      body: input
    });
  },
  update(id: string, input: Partial<BlogPostInput>): Promise<BlogPost> {
    return apiRequest<BlogPost>(`/api/posts/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: input
    });
  },
  remove(id: string): Promise<void> {
    return apiRequest(`/api/posts/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
  }
};
