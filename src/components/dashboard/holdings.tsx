import { HoldingWithPrice } from "@/app/(app)/dashboard/page";
import { CompanyLogo } from "@/components/company-logo";
import { Folio } from "@/components/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function Holdings({ holdings }: { holdings: HoldingWithPrice[] }) {
  // const supabase = createClient();

  // if (isLoading) {
  //   return (
  //     <div className="mx-auto my-auto flex flex-col items-center justify-center gap-2 pt-8">
  //       Loading holdings...
  //     </div>
  //   );
  // }

  return holdings && holdings.length > 0 ? (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ticker</TableHead>
          <TableHead className="text-center">Quantity</TableHead>
          <TableHead className="text-center">Avg. Purchase Price</TableHead>
          <TableHead className="text-center">Current Price</TableHead>
          <TableHead className="text-center">Total Value</TableHead>
          <TableHead className="text-right">Total Gain / Loss</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {holdings.slice(0, 10).map((holding, index) => (
          <TableRow key={index}>
            <TableCell>
              <div className="inline-flex items-center gap-2">
                <div className="h-4 w-4">
                  <CompanyLogo company={holding.ticker} />
                </div>
                {holding.ticker}
              </div>
            </TableCell>
            <TableCell className="text-center">{holding.quantity}</TableCell>
            <TableCell className="text-center">
              $
              {(holding.spend / holding.quantity).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </TableCell>
            <TableCell className="text-center">
              {holding.currentPrice
                ? `$${holding.currentPrice.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : "Loading..."}
            </TableCell>
            <TableCell className="text-center">
              {holding.totalValue
                ? `$${holding.totalValue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : `$${holding.spend.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
            </TableCell>
            <TableCell
              className={`text-right ${
                holding.gainLoss !== undefined
                  ? holding.gainLoss > 0
                    ? "text-[#66873C]"
                    : holding.gainLoss < 0
                      ? "text-[#D9534F]"
                      : ""
                  : ""
              }`}
            >
              {holding.gainLoss !== undefined
                ? `${holding.gainLoss >= 0 ? "+" : "-"}$${Math.abs(
                    holding.gainLoss,
                  ).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} (${holding.gainLoss >= 0 ? "+" : ""}${holding.gainLossPercentage?.toFixed(2)}%)`
                : "Calculating..."}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <div className="mx-auto my-auto flex flex-col items-center justify-center gap-2 pt-8">
      <Folio className="h-8 w-8" /> <div>Your Folio is currently empty</div>
    </div>
  );
}
