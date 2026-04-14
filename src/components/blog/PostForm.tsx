"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Field } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import type { BlogPost, BlogPostInput } from "@/types/blog";
import { useState } from "react";

const schema = z.object({
  title: z.string().min(3, "Informe um título com pelo menos 3 caracteres."),
  excerpt: z.string().min(10, "Informe um resumo curto (mín. 10 caracteres)."),
  content: z.string().min(30, "O conteúdo precisa ter pelo menos 30 caracteres."),
  author: z.string().min(2, "Informe o autor."),
  coverImage: z
    .string()
    .url("URL inválida.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  tagsInput: z.string().optional(),
  status: z.enum(["draft", "published"])
});

type FormValues = z.infer<typeof schema>;

export function PostForm({
  defaultValues,
  submitLabel,
  onSubmit
}: {
  defaultValues?: Partial<BlogPost>;
  submitLabel: string;
  onSubmit: (input: BlogPostInput) => Promise<void>;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      excerpt: defaultValues?.excerpt ?? "",
      content: defaultValues?.content ?? "",
      author: defaultValues?.author ?? "Equipe Byte7",
      coverImage: defaultValues?.coverImage ?? "",
      tagsInput: defaultValues?.tags?.join(", ") ?? "",
      status: (defaultValues?.status as "draft" | "published") ?? "draft"
    }
  });

  const submit = handleSubmit(async (values) => {
    setServerError(null);
    const tags = (values.tagsInput ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      await onSubmit({
        title: values.title,
        excerpt: values.excerpt,
        content: values.content,
        author: values.author,
        coverImage: values.coverImage,
        tags,
        status: values.status
      });
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Não foi possível salvar o post."
      );
    }
  });

  return (
    <form onSubmit={submit} className="space-y-5">
      {serverError ? <Alert tone="error">{serverError}</Alert> : null}

      <Field label="Título" htmlFor="title" error={errors.title?.message}>
        <Input id="title" invalid={!!errors.title} {...register("title")} />
      </Field>

      <Field label="Resumo" htmlFor="excerpt" error={errors.excerpt?.message}>
        <Textarea
          id="excerpt"
          rows={3}
          invalid={!!errors.excerpt}
          {...register("excerpt")}
        />
      </Field>

      <Field
        label="Conteúdo"
        htmlFor="content"
        error={errors.content?.message}
        hint="Texto simples. Parágrafos separados por linha em branco."
      >
        <Textarea
          id="content"
          rows={12}
          invalid={!!errors.content}
          {...register("content")}
        />
      </Field>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Autor" htmlFor="author" error={errors.author?.message}>
          <Input id="author" invalid={!!errors.author} {...register("author")} />
        </Field>
        <Field
          label="Imagem de capa (URL)"
          htmlFor="coverImage"
          error={errors.coverImage?.message}
        >
          <Input
            id="coverImage"
            type="url"
            placeholder="https://…"
            invalid={!!errors.coverImage}
            {...register("coverImage")}
          />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Tags"
          htmlFor="tagsInput"
          hint="Separe por vírgula. Ex.: energia, tokenização"
        >
          <Input id="tagsInput" {...register("tagsInput")} />
        </Field>
        <Field label="Status" htmlFor="status">
          <Select id="status" {...register("status")}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </Select>
        </Field>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
