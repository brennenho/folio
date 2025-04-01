import { PortfolioGraph } from "@/components/chat/portfolio-graph";
import { PortfolioTable } from "@/components/chat/portfolio-table";
import type { Components } from "@/components/chat/types";

export function Response({
  components,
  active,
}: {
  components: Components[];
  active: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <PortfolioGraph components={components} active={true} />
      <div className="rounded-2xl border p-4 shadow-md">
        <PortfolioTable components={components} />
      </div>
    </div>
  );
}
