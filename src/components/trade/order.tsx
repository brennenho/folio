"use client";

import { CompanyLogo } from "@/components/company-logo";
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
import { Spinner } from "@/components/ui/spinner";
import { createClient } from "@/lib/supabase/client";
import { getMarketStatus, getStockPrice } from "@/lib/trades";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Ban, HandCoins } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { search, results, isLoading } = useTickerSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasEnoughShares, setHasEnoughShares] = useState(true);
  const [ownsStock, setOwnsStock] = useState(false);
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");

  const { isOpen } = getMarketStatus();

  useEffect(() => {
    const fetchPrice = async () => {
      const ticker = form.watch("ticker");
      if (ticker) {
        try {
          const price = await getStockPrice(ticker);
          setCurrentPrice(price);
        } catch {
          setCurrentPrice(null);
        }
      } else {
        setCurrentPrice(null);
      }
    };

    fetchPrice();
  }, [form.watch("ticker")]);

  // Keep our local state in sync with the form
  useEffect(() => {
    setOrderType(form.watch("type"));
  }, [form.watch("type")]);

  async function checkUserHoldings() {
    const ticker = form.watch("ticker");
    const quantity = form.watch("quantity");
    const type = form.watch("type");

    if (!ticker) {
      setHasEnoughShares(true);
      setOwnsStock(false);
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setHasEnoughShares(false);
      setOwnsStock(false);
      return;
    }

    const { data: holding } = await supabase
      .from("holdings")
      .select("quantity")
      .eq("ticker", ticker.toUpperCase())
      .eq("user_id", user.id)
      .single();

    // Set whether the user owns any of this stock
    setOwnsStock(!!holding && !!holding.quantity && holding.quantity > 0);

    // Only check if they have enough shares if they're trying to sell
    if (quantity && type === "sell") {
      setHasEnoughShares(
        !!holding && holding.quantity !== null && holding.quantity >= quantity,
      );
    } else {
      setHasEnoughShares(true);
    }
  }

  useEffect(() => {
    checkUserHoldings();
  }, [form.watch("ticker"), form.watch("quantity"), form.watch("type")]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    const supabase = createClient();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return;
      }

      if (values.type === "sell") {
        const { data: holding } = await supabase
          .from("holdings")
          .select("quantity")
          .eq("ticker", values.ticker.toUpperCase())
          .eq("user_id", user.id)
          .single();

        if (
          !holding ||
          !holding.quantity ||
          holding.quantity < values.quantity
        ) {
          toast.error("You don't have enough shares to sell");
          setSubmitting(false);
          return;
        }
      }

      const stockPrice = await getStockPrice(values.ticker);

      const spendChange =
        values.type === "buy"
          ? values.quantity * stockPrice
          : -values.quantity * stockPrice;

      const { data: existingUser } = await supabase
        .from("profiles")
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

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
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
        profileError ||
        !profile
      ) {
        toast.error("An error occurred while placing the order");
        return;
      }

      toast.success("Order placed successfully");

      // Reset form and explicitly set the order type to "buy"
      form.reset({
        ticker: "",
        quantity: undefined,
        type: "buy",
      });

      // Force update our local state to ensure UI reflects the change
      setOrderType("buy");

      queryClient.invalidateQueries({ queryKey: ["trades"] });
      queryClient.invalidateQueries({ queryKey: ["holdings"] });
    } catch {
      toast.error("An error occurred while placing the order");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    // If user doesn't own the stock but "sell" is selected, switch to "buy"
    if (!ownsStock && form.watch("type") === "sell") {
      form.setValue("type", "buy");
      setOrderType("buy");
    }
  }, [ownsStock, form]);

  return (
    <div className="flex w-full items-center justify-center gap-8">
      {isOpen && (
        <div className="flex w-44 flex-col items-center justify-center gap-2 text-center">
          {currentPrice !== null ? (
            <div className="h-10 w-10 rounded-full">
              <CompanyLogo company={form.watch("ticker")} />
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DCEAC9]">
              <HandCoins />
            </div>
          )}
          <div className="w-full overflow-hidden truncate whitespace-nowrap">
            {form.watch("ticker") || "Your Stock"}
          </div>
          <div className="flex items-center justify-center gap-1">
            Current Price:{" "}
            <span className="font-semibold">
              $
              {form.watch("ticker") && currentPrice !== null
                ? `${currentPrice}`
                : "0.00"}
            </span>
          </div>
          <div>
            Total Price: $
            {currentPrice !== null && form.watch("quantity")
              ? (currentPrice * form.watch("quantity")).toFixed(2)
              : "0.00"}
          </div>
        </div>
      )}
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
                          // delay closing to allow for selection
                          setTimeout(() => setOpen(false), 200);
                        }}
                      />
                      {open && results.length > 0 && (
                        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-background shadow-lg">
                          <ul>
                            {results.map((result) => (
                              <li
                                key={result.ticker}
                                className="flex cursor-pointer items-center px-2 py-1 hover:bg-muted"
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
                          {isLoading && <Spinner className="py- h-4 w-4" />}
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
                          value === "" ? undefined : Number.parseFloat(value),
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
                      value={orderType}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setOrderType(value as "buy" | "sell");
                      }}
                      disabled={!isOpen}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Buy">
                          {orderType === "buy" ? "Buy" : "Sell"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy">Buy</SelectItem>
                        <SelectItem value="sell" disabled={!ownsStock}>
                          Sell
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={
              !isOpen ||
              submitting ||
              (orderType === "sell" && !hasEnoughShares)
            }
          >
            {submitting ? (
              <Spinner className="h-4 w-4" />
            ) : isOpen ? (
              "Confirm Trade"
            ) : (
              <div className="inline-flex items-center gap-2">
                <Ban /> Market Closed
              </div>
            )}
          </Button>
        </form>
        {orderType === "sell" &&
          !hasEnoughShares &&
          form.watch("ticker") &&
          form.watch("quantity") && (
            <div className="text-sm text-red-500">
              You don't have enough shares to sell
            </div>
          )}
      </Form>
    </div>
  );
}
