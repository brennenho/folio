"use client";

import { CompanyLogo } from "@/components/company-logo";
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
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Trades {
  ticker: string;
  quantity: number;
  price: number;
  created_at: string;
  is_buy: boolean;
}

export function TradeHistory() {
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };

    fetchUser();
  }, []);

  const { data, error, isLoading } = useQuery({
    queryKey: ["trades", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (error) {
      toast.error("An error occurred while fetching trade history");
    }
  }, [error]);

  const trades = data || [];

  if (isLoading) {
    return <div>Loading trade history...</div>;
  }

  return trades.length > 0 ? (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ticker</TableHead>
          <TableHead className="text-center">Order Type</TableHead>
          <TableHead className="text-center">Quantity</TableHead>
          <TableHead className="text-center">Executed Price</TableHead>
          <TableHead className="text-right">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trades.map((trade) => (
          <TableRow key={trade.created_at}>
            <TableCell>
              <div className="inline-flex items-center gap-2">
                <div className="h-4 w-4">
                  <CompanyLogo company={trade.ticker} />
                </div>
                {trade.ticker}
              </div>
            </TableCell>
            <TableCell
              className={`text-center ${trade.is_buy ? "text-[#66873C]" : "text-[#D9534F]"}`}
            >
              {trade.is_buy ? "Buy" : "Sell"}
            </TableCell>
            <TableCell className="text-center">{trade.quantity}</TableCell>
            <TableCell className="text-center">${trade.price}</TableCell>
            <TableCell className="text-right">
              {new Date(trade.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        No history, start trading to see your trades here.
      </div>
    </div>
  );
}
