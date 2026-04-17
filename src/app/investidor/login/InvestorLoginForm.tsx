"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useState } from "react";

import { Container } from "@/components/ui/Container";
import { Card, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Label";
import { Alert } from "@/components/ui/Alert";
import { Logo } from "@/components/ui/Logo";
import { authService } from "@/services/auth.service";

const schema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "Informe a senha.")
});

type FormValues = z.infer<typeof schema>;

export function InvestorLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirect") || "/investidor";
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "investidor@coopergac.com.br",
      password: "investidor123"
    }
  });

  const submit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await authService.loginInvestor(values);
      router.replace(redirectTo);
      router.refresh();
    } catch {
      setServerError("Credenciais inválidas. Tente novamente.");
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-ink-50 flex items-center">
      <Container className="max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <Card>
          <CardBody className="space-y-5">
            <div className="text-center">
              <h1 className="text-xl font-semibold text-ink-900">
                Área do investidor
              </h1>
              <p className="mt-1 text-sm text-ink-500">
                Consulte suas posições, usinas e contrato.
              </p>
            </div>

            {serverError ? <Alert tone="error">{serverError}</Alert> : null}

            <form onSubmit={submit} className="space-y-4">
              <Field label="E-mail" htmlFor="email" error={errors.email?.message}>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  invalid={!!errors.email}
                  {...register("email")}
                />
              </Field>
              <Field label="Senha" htmlFor="password" error={errors.password?.message}>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  invalid={!!errors.password}
                  {...register("password")}
                />
              </Field>
              <Button type="submit" className="w-full" loading={isSubmitting}>
                Entrar
              </Button>
            </form>

            <div className="rounded-md bg-brand-50 border border-brand-100 p-3 text-xs text-ink-700 space-y-1">
              <p className="font-medium text-brand-800">Credenciais da demo</p>
              <p><code>investidor@coopergac.com.br</code> · <code>investidor123</code></p>
            </div>

            <p className="text-center text-xs text-ink-500">
              <Link href="/" className="hover:text-brand-700">
                ← Voltar ao site
              </Link>
            </p>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
}
