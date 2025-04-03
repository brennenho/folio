"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import type { Components } from "@/components/chat/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
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
        const value = Number.parseFloat(
          company.financial_metrics.allocation ?? "0",
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
  const [timeRange, setTimeRange] = React.useState("1y");
  const [stockData, setStockData] = useState<any[]>([]);
  const [yAxisDomain, setYAxisDomain] = useState<[number, number]>([0, 0]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedData, setHasLoadedData] = useState(false);

  // only calculate tickers when active to prevent unnecessary work
  const tickers = useMemo(
    () => (active ? extractTickers(components) : []),
    [components, active],
  );

  const fetchStockData = useCallback(async () => {
    if (!active || tickers.length === 0) return;

    setIsLoading(true);
    try {
      const endpointMap: Record<string, string> = {
        "1d": "/api/stock-data/daily",
        "7d": "/api/stock-data/weekly",
        "30d": "/api/stock-data/monthly",
        "6m": "/api/stock-data/six-month",
        "1y": "/api/stock-data/yearly",
        "5y": "/api/stock-data/five-year",
      };

      const endpoint = endpointMap[timeRange];
      if (!endpoint) {
        throw new Error(`Invalid time range: ${timeRange}`);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FOLIO_API_URL}${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tickers),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch stock data: ${response.status}`);
      }

      const data = await response.json();
      const formattedData = Object.entries(data).map(([ticker, tickerData]) => {
        return tickerData.data.map((item: any) => ({
          date: item.timestamp,
          close: item.close,
          ticker,
        }));
      });

      // Flatten the array and sort by date
      const mergedData = formattedData.flat().sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

      // Process data to handle missing points properly
      const processedData = processDataForConsistency(mergedData, tickers);

      // Calculate Y-axis domain to focus on the range where data varies
      if (processedData.length > 0) {
        const values = processedData.map((item) => item.close);
        const min = Math.min(...values);
        const max = Math.max(...values);

        // Add padding (10% of the range) to make the chart more readable
        const range = max - min;
        const padding = range * 0.1;

        // Set the domain with padding, ensuring we don't go below 0 if values are positive
        const lowerBound = Math.max(0, min - padding);
        const upperBound = max + padding;

        setYAxisDomain([lowerBound, upperBound]);
      }

      setStockData(processedData);
      setHasLoadedData(true);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [active, tickers, timeRange]);

  // Process data to ensure consistency and prevent empty values from being treated as zero
  const processDataForConsistency = (
    data: any[],
    tickers: Array<{ ticker: string; allocation: number }>,
  ) => {
    // Create a map of ticker to allocation for quick lookup
    const allocationMap = new Map();
    tickers.forEach((item) => {
      allocationMap.set(item.ticker, item.allocation);
    });

    // Group data by date to identify dates with data
    const dateMap = new Map();

    data.forEach((item) => {
      const date = item.date;
      if (!dateMap.has(date)) {
        dateMap.set(date, []);
      }
      dateMap.get(date).push(item);
    });

    // Create a continuous series of dates
    const dates = Array.from(dateMap.keys()).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );

    // For each date, calculate the weighted portfolio value
    return dates
      .map((date) => {
        const items = dateMap.get(date);

        // Calculate portfolio value for this date with allocation weights
        // Only include dates that have actual data
        if (items.length > 0) {
          const portfolioValue = items.reduce((sum: number, item: any) => {
            // Get the allocation weight for this ticker (default to 0 if not found)
            const allocation = allocationMap.get(item.ticker) || 0;
            // Multiply the close price by the allocation weight
            return sum + (Number.parseFloat(item.close) || 0) * allocation;
          }, 0);

          return {
            date,
            close: portfolioValue,
          };
        }

        // Skip dates with no data (this is key to preventing zeros)
        return null;
      })
      .filter(Boolean); // Remove null entries
  };

  useEffect(() => {
    if (active && tickers.length > 0) {
      void fetchStockData();
    }
  }, [active, tickers, timeRange, fetchStockData]);

  // Format large numbers for display
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

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
            <SelectItem value="1d" className="rounded-lg">
              Last 1 day
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="6m" className="rounded-lg">
              Last 6 months
            </SelectItem>
            <SelectItem value="1y" className="rounded-lg">
              Last 1 year
            </SelectItem>
            <SelectItem value="5y" className="rounded-lg">
              Last 5 years
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={stockData}>
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
                const date = new Date(value as string);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              domain={yAxisDomain}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatYAxis}
              width={60}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value as string).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      },
                    );
                  }}
                  formatter={(value, name) => {
                    if (name === "close") {
                      // Format as currency
                      return [
                        `$${Number(value).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`,
                        "Value",
                      ];
                    }
                    return [value, name];
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="close"
              type="monotone"
              fill="url(#fillDesktop)"
              stroke="var(--color-portfolio)"
              strokeWidth={2}
              connectNulls={true} // This is key - connect across null values
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
