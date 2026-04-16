"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Field } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import type {
  InvestorProfile,
  InvestorProfileInput
} from "@/types/investorProfile";

const BR_UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

const schema = z.object({
  fullName: z.string().min(3, "Informe o nome completo."),
  email: z.string().email("E-mail inválido."),
  document: z.string().min(5, "Informe o documento (CPF ou CNPJ)."),
  phone: z.string().min(5, "Informe o telefone."),
  city: z.string().min(2, "Informe a cidade."),
  state: z.string().length(2, "UF inválida."),
  status: z.enum(["ativo", "pendente", "inativo"]),
  notes: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export function InvestorForm({
  defaultValues,
  submitLabel,
  onSubmit
}: {
  defaultValues?: Partial<InvestorProfile>;
  submitLabel: string;
  onSubmit: (input: InvestorProfileInput) => Promise<void>;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: defaultValues?.fullName ?? "",
      email: defaultValues?.email ?? "",
      document: defaultValues?.document ?? "",
      phone: defaultValues?.phone ?? "",
      city: defaultValues?.city ?? "",
      state: defaultValues?.state ?? "SP",
      status:
        (defaultValues?.status as "ativo" | "pendente" | "inativo") ?? "ativo",
      notes: defaultValues?.notes ?? ""
    }
  });

  const submit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await onSubmit({
        fullName: values.fullName,
        email: values.email,
        document: values.document,
        phone: values.phone,
        city: values.city,
        state: values.state,
        status: values.status,
        notes: values.notes?.trim() ? values.notes : undefined
      });
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Não foi possível salvar o cadastro."
      );
    }
  });

  return (
    <form onSubmit={submit} className="space-y-5">
      {serverError ? <Alert tone="error">{serverError}</Alert> : null}

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Nome completo" htmlFor="fullName" error={errors.fullName?.message}>
          <Input id="fullName" invalid={!!errors.fullName} {...register("fullName")} />
        </Field>
        <Field label="E-mail" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" invalid={!!errors.email} {...register("email")} />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Documento (CPF ou CNPJ)"
          htmlFor="document"
          error={errors.document?.message}
        >
          <Input id="document" invalid={!!errors.document} {...register("document")} />
        </Field>
        <Field label="Telefone" htmlFor="phone" error={errors.phone?.message}>
          <Input id="phone" invalid={!!errors.phone} {...register("phone")} />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Field label="Cidade" htmlFor="city" error={errors.city?.message}>
          <Input id="city" invalid={!!errors.city} {...register("city")} />
        </Field>
        <Field label="UF" htmlFor="state" error={errors.state?.message}>
          <Select id="state" {...register("state")}>
            {BR_UFS.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Status" htmlFor="status">
          <Select id="status" {...register("status")}>
            <option value="ativo">Ativo</option>
            <option value="pendente">Pendente</option>
            <option value="inativo">Inativo</option>
          </Select>
        </Field>
      </div>

      <Field label="Observações" htmlFor="notes" hint="Opcional · uso interno do admin">
        <Textarea id="notes" rows={4} {...register("notes")} />
      </Field>

      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
