import { Suspense } from "react";
import { EditorLoginForm } from "./EditorLoginForm";

export const dynamic = "force-dynamic";

export default function EditorLoginPage() {
  return (
    <Suspense fallback={null}>
      <EditorLoginForm />
    </Suspense>
  );
}
