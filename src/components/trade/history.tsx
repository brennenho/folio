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
  const [trades, setTrades] = useState<Trades[]>([]);

  useEffect(() => {
    const fetchTrades = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("An error occurred while fetching trade history");
      } else {
        setTrades(data);
      }
    };
    fetchTrades();
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ticker</TableHead>
          <TableHead className="text-center">Order Type</TableHead>
          <TableHead className="text-center">Quantity</TableHead>
          <TableHead className="text-center">Price Executed</TableHead>
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
  );
}
