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
import { createClient } from "@/lib/supabase/client";
import { getStockPrice } from "@/lib/trades";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

type HoldingWithPrice = {
  ticker: string;
  quantity: number;
  spend: number;
  user_id: string;
  currentPrice?: number;
  totalValue?: number;
  gainLoss?: number;
  gainLossPercentage?: number;
};

export function Holdings({ user_id }: { user_id: string }) {
  const supabase = createClient();

  const {
    data: holdings,
    error: holdingsError,
    isLoading,
  } = useQuery({
    queryKey: ["holdings", user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("holdings")
        .select("*")
        .eq("user_id", user_id)
        .order("spend", { ascending: false });

      if (error) {
        toast.error("An error occurred fetching your holdings");
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      // fetch current prices for each holding
      const holdingsWithPrices: HoldingWithPrice[] = await Promise.all(
        data.map(async (holding) => {
          try {
            const currentPrice = await getStockPrice(holding.ticker);

            const totalValue = holding.quantity * currentPrice;
            const gainLoss = totalValue - holding.spend;
            const gainLossPercentage = (gainLoss / holding.spend) * 100;

            return {
              ...holding,
              currentPrice,
              totalValue,
              gainLoss,
              gainLossPercentage,
            };
          } catch {
            toast.error(`Error fetching price for ${holding.ticker}`);
            return holding;
          }
        }),
      );

      return holdingsWithPrices;
    },
    enabled: !!user_id,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <div className="mx-auto my-auto flex flex-col items-center justify-center gap-2 pt-8">
        Loading holdings...
      </div>
    );
  }

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
              className={`text-right ${holding.gainLoss && holding.gainLoss > 0 ? "text-[#66873C]" : holding.gainLoss && holding.gainLoss < 0 ? "text-[#D9534F]" : ""}`}
            >
              {holding.gainLoss !== undefined
                ? `${holding.gainLoss >= 0 ? "+" : "-"}$${Math.abs(
                    holding.gainLoss,
                  ).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} (${holding.gainLoss >= 0 ? "+" : "-"}${holding.gainLossPercentage?.toFixed(2)}%)`
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
