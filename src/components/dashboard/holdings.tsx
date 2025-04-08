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
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function Holdings({ user_id }: { user_id: string }) {
  const supabase = createClient();

  const {
    data: holdings,
    error: holdingsError,
    isLoading,
  } = useQuery({
    queryKey: ["holdings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("holdings")
        .select("*")
        .eq("user_id", user_id)
        .order("spend", { ascending: false });

      if (error) {
        toast.error("An error occurred fetching your holdings");
      }
      return data;
    },
    enabled: !!user_id,
  });

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
            <TableCell className="text-center">current price</TableCell>
            <TableCell className="text-center">
              $
              {holding.spend.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </TableCell>
            <TableCell className="text-right">gains/loss</TableCell>
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
