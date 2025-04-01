import { CompanyLogo } from "@/components/company-logo";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Company {
  name: string;
  ticker: string;
  specialization: string;
  investment_thesis: Record<string, any>;
  financial_metrics: Record<string, any>;
}

interface Components {
  component_name: string;
  component_description: string;
  companies: Company[];
}

export function PortfolioTable({ components }: { components: Components[] }) {
  const fixCapitalization = (value: string | null) => {
    if (!value) return "";
    return value
      .toLowerCase()
      .split(" ")
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  };

  return (
    <Table className="text-center text-xs text-border">
      <TableHeader>
        <TableRow>
          <TableHead className="border-r"></TableHead>
          <TableHead className="border-r text-center">Allocation</TableHead>
          <TableHead className="border-r text-center">1-Year Return</TableHead>
          <TableHead className="border-r text-center">Volatility</TableHead>
          <TableHead className="border-r text-center">Dividend Yield</TableHead>
          <TableHead className="border-r text-center">Market Cap</TableHead>
          <TableHead className="border-r text-center">Sector</TableHead>
          <TableHead className="text-center">Focus</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {components &&
          components.map((component) =>
            component.companies.map((company: Company) => (
              <TableRow key={company.ticker}>
                <TableCell className="border-r text-left font-semibold">
                  <div className="inline-flex items-center justify-center gap-2">
                    <div className="h-6 w-6">
                      <CompanyLogo company={company.ticker} />
                    </div>
                    {company.ticker}
                  </div>
                </TableCell>
                <TableCell className="border-r"></TableCell>
                <TableCell className="border-r">
                  {company.financial_metrics.one_year_return}
                </TableCell>
                <TableCell className="border-r">
                  {company.financial_metrics.volatility}
                </TableCell>
                <TableCell className="border-r">
                  {company.financial_metrics.dividend_yield}
                </TableCell>
                <TableCell className="border-r">
                  {company.financial_metrics.market_cap}
                </TableCell>
                <TableCell className="border-r">
                  {fixCapitalization(company.financial_metrics.sector)}
                </TableCell>
                <TableCell>{component.component_name}</TableCell>
              </TableRow>
            )),
          )}
      </TableBody>
    </Table>
  );
}
