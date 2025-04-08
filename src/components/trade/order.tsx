"use client";

import { useTickerSearch } from "@/components/trade/search";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { getStockPrice } from "@/lib/trades";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Ban } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  ticker: z.string().min(1).max(5),
  quantity: z
    .number()
    .positive()
    .refine(
      (val) => {
        const decimalStr = val.toString().split(".")[1] || "";
        return decimalStr.length <= 1;
      },
      { message: "Precision is limited to 1 decimal" },
    ),
  type: z.enum(["buy", "sell"]),
});

export function Order() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticker: "",
      quantity: undefined,
      type: "buy",
    },
  });

  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { search, results, isLoading } = useTickerSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  // const { isOpen } = getMarketStatus();
  const isOpen = true;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const supabase = createClient();

    try {
      const stockPrice = await getStockPrice(values.ticker);

      const spendChange =
        values.type === "buy"
          ? values.quantity * stockPrice
          : -values.quantity * stockPrice;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return;
      }

      const { data: existingUser } = await supabase
        .from("user_data")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!existingUser || existingUser.cash - spendChange < 0) {
        toast.error("You don't have enough buying power to place this order");
        return;
      }

      const { data: tradesData, error: tradesError } = await supabase
        .from("trades")
        .insert({
          ticker: values.ticker.toUpperCase(),
          quantity: values.quantity,
          price: stockPrice,
          is_buy: values.type === "buy",
        })
        .select();

      // check if the holding already exists
      const { data: existing } = await supabase
        .from("holdings")
        .select("*")
        .eq("ticker", values.ticker.toUpperCase())
        .eq("user_id", user.id)
        .single();

      const quantityChange =
        values.type === "buy" ? values.quantity : -values.quantity;
      const newQuantity =
        existing && existing.quantity
          ? existing.quantity + quantityChange
          : quantityChange;

      const newSpend =
        existing && existing.spend ? existing.spend + spendChange : spendChange;

      // insert or update with the calculated quantity
      const { data: holdingsData, error: holdingsError } = await supabase
        .from("holdings")
        .upsert(
          {
            ticker: values.ticker.toUpperCase(),
            user_id: user.id,
            quantity: newQuantity,
            spend: newSpend,
          },
          {
            onConflict: "ticker,user_id",
            ignoreDuplicates: false,
          },
        )
        .select();

      const { data: userData, error: userError } = await supabase
        .from("user_data")
        .update({
          cash: existingUser.cash - spendChange,
        })
        .eq("user_id", user.id)
        .select();

      if (
        tradesError ||
        !tradesData ||
        holdingsError ||
        !holdingsData ||
        userError ||
        !userData
      ) {
        toast.error("An error occurred while placing the order");
        return;
      }
      toast.success("Order placed successfully");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["trades"] });
      queryClient.invalidateQueries({ queryKey: ["holdings"] });
    } catch {
      toast.error("An error occurred while placing the order");
      return;
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex w-full gap-4">
          <FormField
            control={form.control}
            name="ticker"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Symbol</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      placeholder="ex: AAPL"
                      {...field}
                      disabled={!isOpen}
                      ref={inputRef}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        search(e.target.value);
                        if (e.target.value) {
                          setOpen(true);
                        } else {
                          setOpen(false);
                        }
                      }}
                      onFocus={() => {
                        if (field.value) {
                          setOpen(true);
                        }
                      }}
                      onBlur={() => {
                        // Delay closing to allow for selection
                        setTimeout(() => setOpen(false), 200);
                      }}
                    />
                    {open && results.length > 0 && (
                      <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-background shadow-lg">
                        <ul>
                          {results.map((result) => (
                            <li
                              key={result.ticker}
                              className="flex cursor-pointer items-center px-4 py-2 hover:bg-muted"
                              onMouseDown={() => {
                                field.onChange(result.ticker);
                                setOpen(false);
                                inputRef.current?.blur();
                              }}
                            >
                              <span className="font-medium">
                                {result.ticker}
                              </span>
                              <span className="ml-2 truncate text-sm text-muted-foreground">
                                {result.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                        {isLoading && (
                          <div className="px-4 py-2 text-center text-muted-foreground">
                            Loading...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value === undefined ? "" : field.value}
                    disabled={!isOpen}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(
                        value === "" ? undefined : parseFloat(value),
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order Type</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    disabled={!isOpen}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Buy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="sell">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full" disabled={!isOpen}>
          {isOpen ? (
            "Confirm Trade"
          ) : (
            <div className="inline-flex items-center gap-2">
              <Ban /> Market Closed
            </div>
          )}
        </Button>
      </form>
    </Form>
  );
}
