"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import type { Components } from "@/components/chat/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useEffect, useMemo, useState } from "react";

const chartData = [
  { date: "2024-04-01", portfolio: 222, reference: 150 },
  { date: "2024-04-02", portfolio: 97, reference: 180 },
  { date: "2024-04-03", portfolio: 167, reference: 120 },
  { date: "2024-04-04", portfolio: 242, reference: 260 },
  { date: "2024-04-05", portfolio: 373, reference: 290 },
  { date: "2024-04-06", portfolio: 301, reference: 340 },
  { date: "2024-04-07", portfolio: 245, reference: 180 },
  { date: "2024-04-08", portfolio: 409, reference: 320 },
  { date: "2024-04-09", portfolio: 59, reference: 110 },
  { date: "2024-04-10", portfolio: 261, reference: 190 },
  { date: "2024-04-11", portfolio: 327, reference: 350 },
  { date: "2024-04-12", portfolio: 292, reference: 210 },
  { date: "2024-04-13", portfolio: 342, reference: 380 },
  { date: "2024-04-14", portfolio: 137, reference: 220 },
  { date: "2024-04-15", portfolio: 120, reference: 170 },
  { date: "2024-04-16", portfolio: 138, reference: 190 },
  { date: "2024-04-17", portfolio: 446, reference: 360 },
  { date: "2024-04-18", portfolio: 364, reference: 410 },
  { date: "2024-04-19", portfolio: 243, reference: 180 },
  { date: "2024-04-20", portfolio: 89, reference: 150 },
  { date: "2024-04-21", portfolio: 137, reference: 200 },
  { date: "2024-04-22", portfolio: 224, reference: 170 },
  { date: "2024-04-23", portfolio: 138, reference: 230 },
  { date: "2024-04-24", portfolio: 387, reference: 290 },
  { date: "2024-04-25", portfolio: 215, reference: 250 },
  { date: "2024-04-26", portfolio: 75, reference: 130 },
  { date: "2024-04-27", portfolio: 383, reference: 420 },
  { date: "2024-04-28", portfolio: 122, reference: 180 },
  { date: "2024-04-29", portfolio: 315, reference: 240 },
  { date: "2024-04-30", portfolio: 454, reference: 380 },
  { date: "2024-05-01", portfolio: 165, reference: 220 },
  { date: "2024-05-02", portfolio: 293, reference: 310 },
  { date: "2024-05-03", portfolio: 247, reference: 190 },
  { date: "2024-05-04", portfolio: 385, reference: 420 },
  { date: "2024-05-05", portfolio: 481, reference: 390 },
  { date: "2024-05-06", portfolio: 498, reference: 520 },
  { date: "2024-05-07", portfolio: 388, reference: 300 },
  { date: "2024-05-08", portfolio: 149, reference: 210 },
  { date: "2024-05-09", portfolio: 227, reference: 180 },
  { date: "2024-05-10", portfolio: 293, reference: 330 },
  { date: "2024-05-11", portfolio: 335, reference: 270 },
  { date: "2024-05-12", portfolio: 197, reference: 240 },
  { date: "2024-05-13", portfolio: 197, reference: 160 },
  { date: "2024-05-14", portfolio: 448, reference: 490 },
  { date: "2024-05-15", portfolio: 473, reference: 380 },
  { date: "2024-05-16", portfolio: 338, reference: 400 },
  { date: "2024-05-17", portfolio: 499, reference: 420 },
  { date: "2024-05-18", portfolio: 315, reference: 350 },
  { date: "2024-05-19", portfolio: 235, reference: 180 },
  { date: "2024-05-20", portfolio: 177, reference: 230 },
  { date: "2024-05-21", portfolio: 82, reference: 140 },
  { date: "2024-05-22", portfolio: 81, reference: 120 },
  { date: "2024-05-23", portfolio: 252, reference: 290 },
  { date: "2024-05-24", portfolio: 294, reference: 220 },
  { date: "2024-05-25", portfolio: 201, reference: 250 },
  { date: "2024-05-26", portfolio: 213, reference: 170 },
  { date: "2024-05-27", portfolio: 420, reference: 460 },
  { date: "2024-05-28", portfolio: 233, reference: 190 },
  { date: "2024-05-29", portfolio: 78, reference: 130 },
  { date: "2024-05-30", portfolio: 340, reference: 280 },
  { date: "2024-05-31", portfolio: 178, reference: 230 },
  { date: "2024-06-01", portfolio: 178, reference: 200 },
  { date: "2024-06-02", portfolio: 470, reference: 410 },
  { date: "2024-06-03", portfolio: 103, reference: 160 },
  { date: "2024-06-04", portfolio: 439, reference: 380 },
  { date: "2024-06-05", portfolio: 88, reference: 140 },
  { date: "2024-06-06", portfolio: 294, reference: 250 },
  { date: "2024-06-07", portfolio: 323, reference: 370 },
  { date: "2024-06-08", portfolio: 385, reference: 320 },
  { date: "2024-06-09", portfolio: 438, reference: 480 },
  { date: "2024-06-10", portfolio: 155, reference: 200 },
  { date: "2024-06-11", portfolio: 92, reference: 150 },
  { date: "2024-06-12", portfolio: 492, reference: 420 },
  { date: "2024-06-13", portfolio: 81, reference: 130 },
  { date: "2024-06-14", portfolio: 426, reference: 380 },
  { date: "2024-06-15", portfolio: 307, reference: 350 },
  { date: "2024-06-16", portfolio: 371, reference: 310 },
  { date: "2024-06-17", portfolio: 475, reference: 520 },
  { date: "2024-06-18", portfolio: 107, reference: 170 },
  { date: "2024-06-19", portfolio: 341, reference: 290 },
  { date: "2024-06-20", portfolio: 408, reference: 450 },
  { date: "2024-06-21", portfolio: 169, reference: 210 },
  { date: "2024-06-22", portfolio: 317, reference: 270 },
  { date: "2024-06-23", portfolio: 480, reference: 530 },
  { date: "2024-06-24", portfolio: 132, reference: 180 },
  { date: "2024-06-25", portfolio: 141, reference: 190 },
  { date: "2024-06-26", portfolio: 434, reference: 380 },
  { date: "2024-06-27", portfolio: 448, reference: 490 },
  { date: "2024-06-28", portfolio: 149, reference: 200 },
  { date: "2024-06-29", portfolio: 103, reference: 160 },
  { date: "2024-06-30", portfolio: 446, reference: 400 },
];

const chartConfig = {
  portfolio: {
    label: "Portfolio",
    color: "hsl(var(--chart-1))",
  },
  reference: {
    label: "S&P 500",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function extractTickers(
  components: Components[],
): Array<{ ticker: string; allocation: number }> {
  return components.flatMap((component) =>
    component.companies.map((company) => {
      const allocationValue = (() => {
        const value = parseFloat(
          company.financial_metrics["allocation"] || "0",
        );
        return isNaN(value) ? 0 : value;
      })();

      return {
        ticker: company.ticker,
        allocation: allocationValue,
      };
    }),
  );
}

export function PortfolioGraph({
  components,
  active = false,
}: {
  components: Components[];
  active?: boolean;
}) {
  const [timeRange, setTimeRange] = React.useState("90d");
  const [stockData, setStockData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedData, setHasLoadedData] = useState(false);

  // only calculate tickers when active to prevent unnecessary work
  const tickers = useMemo(
    () => (active ? extractTickers(components) : []),
    [components, active],
  );

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  // useCallback to memoize the fetchData function
  const fetchData = useCallback(async () => {
    if (hasLoadedData || !active || tickers.length === 0) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tickers }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data);
      setStockData(data);
      setHasLoadedData(true);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [active, hasLoadedData, tickers]);

  useEffect(() => {
    // only fetch if component is active, we haven't loaded data yet, and we have tickers
    if (active && !hasLoadedData && tickers.length > 0) {
      // add a small delay to avoid multiple fetches when switching tabs quickly
      const timeoutId = setTimeout(() => {
        fetchData();
      }, 100);

      // clean up timeout if component unmounts or dependencies change
      return () => clearTimeout(timeoutId);
    }
  }, [active, hasLoadedData, tickers, fetchData]);

  // if not active, render minimal content or nothing
  if (!active) {
    return <div className="lazy-loading-placeholder" />;
  }

  return (
    <Card className="border-0 bg-inherit shadow-none">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Portfolio</CardTitle>
          {isLoading && (
            <div className="text-sm text-muted-foreground">Loading data...</div>
          )}
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-portfolio)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-portfolio)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-reference)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-reference)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="reference"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-reference)"
              stackId="a"
            />
            <Area
              dataKey="portfolio"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-portfolio)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
