import { ContractView } from "@/components/investor/ContractView";
import { MOCK_CONTRACT } from "@/mocks/investor";

export const dynamic = "force-dynamic";

export default function ContratoPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-ink-900 tracking-tight">
          Contrato
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Visualize as cláusulas do seu contrato ou baixe uma cópia.
        </p>
      </div>
      <ContractView contract={MOCK_CONTRACT} />
    </div>
  );
}
