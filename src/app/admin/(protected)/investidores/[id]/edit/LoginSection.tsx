"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Mail, UserPlus } from "lucide-react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Field } from "@/components/ui/Label";

interface LoginInfo {
  id: string;
  name: string;
  email: string;
}

export function LoginSection({
  investorId,
  profileFullName,
  profileEmail,
  login
}: {
  investorId: string;
  profileFullName: string;
  profileEmail: string;
  login: LoginInfo | null;
}) {
  if (login) {
    return (
      <ResetPasswordCard investorId={investorId} login={login} />
    );
  }
  return (
    <CreateLoginCard
      investorId={investorId}
      defaultName={profileFullName}
      defaultEmail={profileEmail}
    />
  );
}

function CreateLoginCard({
  investorId,
  defaultName,
  defaultEmail
}: {
  investorId: string;
  defaultName: string;
  defaultEmail: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (password.length < 6) {
      setError("A senha precisa ter ao menos 6 caracteres.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/investors/${investorId}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "Falha ao criar acesso.");
      }
      const created = await res.json();
      setSuccess(`Acesso criado: ${created.email}`);
      setPassword("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao criar acesso.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acesso ao portal</CardTitle>
        <span className="text-xs text-ink-500">
          Este investidor ainda não tem login. Defina os dados e a senha
          inicial.
        </span>
      </CardHeader>
      <CardBody>
        {error ? <Alert tone="error">{error}</Alert> : null}
        {success ? <Alert tone="success">{success}</Alert> : null}
        <form onSubmit={submit} className="space-y-4 mt-1">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nome exibido" htmlFor="log-name">
              <Input
                id="log-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Field>
            <Field
              label="E-mail de login"
              htmlFor="log-email"
              hint="Usado no /investidor/login"
            >
              <Input
                id="log-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
          </div>
          <Field
            label="Senha inicial"
            htmlFor="log-password"
            hint="Mínimo 6 caracteres · o admin pode redefinir depois"
          >
            <Input
              id="log-password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ex.: temp123"
              required
            />
          </Field>
          <div className="flex justify-end">
            <Button type="submit" size="sm" loading={busy}>
              <UserPlus className="h-4 w-4" /> Criar acesso
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

function ResetPasswordCard({
  investorId,
  login
}: {
  investorId: string;
  login: LoginInfo;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (password.length < 6) {
      setError("A senha precisa ter ao menos 6 caracteres.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(
        `/api/investors/${investorId}/login/password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password })
        }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "Falha ao redefinir senha.");
      }
      setSuccess("Senha redefinida.");
      setPassword("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao redefinir.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acesso ao portal</CardTitle>
        <span className="text-xs text-ink-500">
          Login vinculado a este investidor. Admin pode redefinir a senha
          abaixo; cada redefinição fica em auditoria (sem o valor da senha).
        </span>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="rounded-md border border-ink-200 bg-ink-50/60 px-3 py-2 text-sm flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <Mail className="h-4 w-4" />
          </span>
          <div>
            <p className="font-medium text-ink-900">{login.name}</p>
            <p className="text-xs text-ink-500">
              {login.email} · id {login.id}
            </p>
          </div>
        </div>

        {error ? <Alert tone="error">{error}</Alert> : null}
        {success ? <Alert tone="success">{success}</Alert> : null}

        <form onSubmit={submit} className="space-y-3">
          <Field
            label="Nova senha"
            htmlFor="log-reset"
            hint="Mínimo 6 caracteres"
          >
            <Input
              id="log-reset"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nova senha"
              required
            />
          </Field>
          <div className="flex justify-end">
            <Button type="submit" size="sm" loading={busy}>
              <KeyRound className="h-4 w-4" /> Redefinir senha
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
