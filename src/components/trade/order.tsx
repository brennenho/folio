"use client";

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
import { getMarketStatus } from "@/lib/trades";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Ban } from "lucide-react";
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
  const { isOpen } = getMarketStatus();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("trades")
      .insert({
        ticker: values.ticker,
        quantity: values.quantity,
        price: 0,
        is_buy: values.type === "buy",
      })
      .select();

    if (error || !data) {
      toast.error("An error occurred while placing the order");
      return;
    }
    toast.success("Order placed successfully");
    form.reset();
    queryClient.invalidateQueries({ queryKey: ["trades"] });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex w-full gap-4">
          <FormField
            control={form.control}
            name="ticker"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Symbol</FormLabel>
                <FormControl>
                  <Input placeholder="ex: AAPL" {...field} disabled={!isOpen} />
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
