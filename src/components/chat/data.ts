import type { Components } from "@/components/chat/types";

export function extractTickers(components: Components[]): string[] {
  return components.flatMap((component) =>
    component.companies.map((company) => company.ticker),
  );
}
