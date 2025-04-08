import { restClient } from "@polygon.io/client-js";

export type LatestStockData = {
  ticker: string;
  lastTrade?: {
    price: number;
    size: number;
    exchange: number;
    timestamp: string;
  };
  lastQuote?: {
    askPrice: number;
    askSize: number;
    bidPrice: number;
    bidSize: number;
    timestamp: string;
  };
  dailyBar?: {
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    vw: number;
  };
  prevDailyBar?: {
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    timestamp: string;
  };
  todaysChange?: number;
  todaysChangePerc?: number;
  updated?: string;
  error?: string;
};

/**
 * Get latest stock data from Polygon API
 */
export async function getLatestStockData(
  ticker: string,
): Promise<LatestStockData> {
  const polygonApiKey = process.env.POLYGON_API_KEY;

  if (!polygonApiKey) {
    return {
      ticker,
      error: "Polygon API key not found in environment variables",
    };
  }

  try {
    // Initialize Polygon REST client
    const client = restClient(polygonApiKey);

    // Fetch snapshot data
    const snapshot = await client.stocks.snapshotTicker(ticker);

    if (!snapshot?.ticker) {
      return {
        ticker,
        error: "No data returned from Polygon API",
      };
    }

    // Transform the data into a structured format
    const result: LatestStockData = {
      ticker: snapshot.ticker.ticker ?? ticker,
      lastTrade: snapshot.ticker.lastTrade
        ? {
            price: snapshot.ticker.lastTrade.p ?? 0,
            size: snapshot.ticker.lastTrade.s ?? 0,
            exchange: snapshot.ticker.lastTrade.x ?? 0,
            timestamp:
              typeof snapshot.ticker.lastTrade.t === "number"
                ? new Date(snapshot.ticker.lastTrade.t).toISOString()
                : "",
          }
        : undefined,
      lastQuote: snapshot.ticker.lastQuote
        ? {
            askPrice: snapshot.ticker.lastQuote.P ?? 0,
            askSize: snapshot.ticker.lastQuote.S ?? 0,
            bidPrice: snapshot.ticker.lastQuote.p ?? 0,
            bidSize: snapshot.ticker.lastQuote.s ?? 0,
            timestamp:
              typeof snapshot.ticker.lastQuote.t === "number"
                ? new Date(snapshot.ticker.lastQuote.t).toISOString()
                : "",
          }
        : undefined,
      dailyBar: snapshot.ticker.day
        ? {
            open: snapshot.ticker.day.o ?? 0,
            high: snapshot.ticker.day.h ?? 0,
            low: snapshot.ticker.day.l ?? 0,
            close: snapshot.ticker.day.c ?? 0,
            volume: snapshot.ticker.day.v ?? 0,
            vw: snapshot.ticker.day.vw ?? 0,
          }
        : undefined,
      prevDailyBar: snapshot.ticker.prevDay
        ? {
            open: snapshot.ticker.prevDay.o ?? 0,
            high: snapshot.ticker.prevDay.h ?? 0,
            low: snapshot.ticker.prevDay.l ?? 0,
            close: snapshot.ticker.prevDay.c ?? 0,
            volume: snapshot.ticker.prevDay.v ?? 0,
            timestamp:
              typeof snapshot.ticker.prevDay.t === "number"
                ? new Date(snapshot.ticker.prevDay.t).toISOString()
                : "",
          }
        : undefined,
      todaysChange: snapshot.ticker.todaysChange,
      todaysChangePerc: snapshot.ticker.todaysChangePerc,
      updated: new Date().toISOString(),
    };

    return result;
  } catch (error: unknown) {
    console.error(`Error fetching latest data for ${ticker}:`, error);
    return {
      ticker,
      error:
        error instanceof Error
          ? (error.message ?? "Failed to fetch latest stock data")
          : "Failed to fetch latest stock data",
    };
  }
}
