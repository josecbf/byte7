import { Suspense } from "react";
import { InvestorLoginForm } from "./InvestorLoginForm";

export const dynamic = "force-dynamic";

export default function InvestorLoginPage() {
  return (
    <Suspense fallback={null}>
      <InvestorLoginForm />
    </Suspense>
  );
}
