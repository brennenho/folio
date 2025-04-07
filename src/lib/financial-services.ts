import { restClient } from "@polygon.io/client-js";

// Type definitions
export type CompanyMetrics = {
  ticker: string;
  name?: string;
  sector?: string;
  market_cap?: string;
  one_year_return?: string;
  volatility?: string;
  dividend_yield?: string;
  last_updated?: string;
  error?: string;
};

export type StockData = {
  meta: {
    ticker: string;
    timespan: string;
    multiplier: number;
    from_date: string;
    to_date: string;
  };
  data: Array<{
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
  error?: string;
};

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
    timestamp: string;
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

    if (!snapshot || !snapshot.ticker) {
      return {
        ticker,
        error: "No data returned from Polygon API",
      };
    }

    // Transform the data into a structured format
    const result: LatestStockData = {
      ticker: snapshot.ticker.ticker,
      lastTrade: snapshot.ticker.lastTrade
        ? {
            price: snapshot.ticker.lastTrade.p,
            size: snapshot.ticker.lastTrade.s,
            exchange: snapshot.ticker.lastTrade.x,
            timestamp: new Date(snapshot.ticker.lastTrade.t).toISOString(),
          }
        : undefined,
      lastQuote: snapshot.ticker.lastQuote
        ? {
            askPrice: snapshot.ticker.lastQuote.P,
            askSize: snapshot.ticker.lastQuote.S,
            bidPrice: snapshot.ticker.lastQuote.p,
            bidSize: snapshot.ticker.lastQuote.s,
            timestamp: new Date(snapshot.ticker.lastQuote.t).toISOString(),
          }
        : undefined,
      dailyBar: snapshot.ticker.day
        ? {
            open: snapshot.ticker.day.o,
            high: snapshot.ticker.day.h,
            low: snapshot.ticker.day.l,
            close: snapshot.ticker.day.c,
            volume: snapshot.ticker.day.v,
            timestamp: new Date(snapshot.ticker.day.t).toISOString(),
          }
        : undefined,
      prevDailyBar: snapshot.ticker.prevDay
        ? {
            open: snapshot.ticker.prevDay.o,
            high: snapshot.ticker.prevDay.h,
            low: snapshot.ticker.prevDay.l,
            close: snapshot.ticker.prevDay.c,
            volume: snapshot.ticker.prevDay.v,
            timestamp: new Date(snapshot.ticker.prevDay.t).toISOString(),
          }
        : undefined,
      todaysChange: snapshot.ticker.todaysChange,
      todaysChangePerc: snapshot.ticker.todaysChangePerc,
      updated: new Date().toISOString(),
    };

    return result;
  } catch (error: any) {
    console.error(`Error fetching latest data for ${ticker}:`, error);
    return {
      ticker,
      error: error.message || "Failed to fetch latest stock data",
    };
  }
}

/**
 * Get company metrics from Polygon API
 */
export async function getCompanyMetrics(
  ticker: string,
): Promise<CompanyMetrics> {
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

    // Initialize results object
    const result: CompanyMetrics = {
      ticker,
      name: "",
      sector: "",
      market_cap: undefined,
      one_year_return: undefined,
      volatility: undefined,
      dividend_yield: undefined,
      last_updated: new Date().toISOString().split("T")[0],
    };

    // Step 1: Fetch company details
    const details = await client.reference.tickerDetails(ticker);
    result.name = details.results?.name;
    result.sector = details.results?.sic_description;

    const marketCap = details.results?.market_cap;
    if (marketCap) {
      result.market_cap = `$${(marketCap / 1e9).toFixed(2)}B`; // Convert to billions
    }

    // Step 2: Fetch historical stock data for 1-year return and volatility
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const fromDate = oneYearAgo.toISOString().split("T")[0];
    const toDate = today.toISOString().split("T")[0];

    const aggs = await client.stocks.aggregates(
      ticker,
      1,
      "day",
      fromDate,
      toDate,
    );

    if (aggs.results && aggs.results.length > 0) {
      // Calculate 1-year return
      const startPrice = aggs.results[0].c;
      const endPrice = aggs.results[aggs.results.length - 1].c;
      const oneYearReturn = (endPrice / startPrice - 1) * 100;
      result.one_year_return = `${oneYearReturn.toFixed(2)}%`;

      // Calculate annualized volatility
      const dailyReturns: number[] = [];
      for (let i = 1; i < aggs.results.length; i++) {
        const dailyReturn = aggs.results[i].c / aggs.results[i - 1].c - 1;
        dailyReturns.push(dailyReturn);
      }

      const mean =
        dailyReturns.reduce((sum, val) => sum + val, 0) / dailyReturns.length;
      const variance =
        dailyReturns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        dailyReturns.length;
      const stdDev = Math.sqrt(variance);
      const annualizedVolatility = stdDev * Math.sqrt(252) * 100;

      result.volatility = `${annualizedVolatility.toFixed(2)}%`;
    } else {
      result.one_year_return = "N/A";
      result.volatility = "N/A";
    }

    // Step 3: Fetch dividend yield
    const dividends = await client.reference.dividends({
      ticker,
      limit: 10,
      sort: "ex_dividend_date",
    });

    if (dividends.results && dividends.results.length > 0) {
      // Calculate total dividends paid in the last year
      const oneYearAgoDate = oneYearAgo.getTime();
      const recentDividends: number[] = [];

      for (const div of dividends.results) {
        const exDividendDate = new Date(div.ex_dividend_date).getTime();
        if (exDividendDate >= oneYearAgoDate) {
          recentDividends.push(div.cash_amount);
        }
      }

      const totalDividends = recentDividends.reduce((sum, val) => sum + val, 0);

      // Calculate dividend yield
      if (aggs.results && aggs.results.length > 0) {
        const averagePrice =
          aggs.results.reduce((sum, agg) => sum + agg.c, 0) /
          aggs.results.length;

        if (averagePrice && totalDividends > 0) {
          const dividendYield = (totalDividends / averagePrice) * 100;
          result.dividend_yield = `${dividendYield.toFixed(2)}%`;
        } else {
          result.dividend_yield = "N/A";
        }
      } else {
        result.dividend_yield = "N/A";
      }
    } else {
      result.dividend_yield = "N/A";
    }

    return result;
  } catch (error: any) {
    console.error(`Error fetching metrics for ${ticker}:`, error);
    return {
      ticker,
      error: error.message || "Failed to fetch company metrics",
    };
  }
}

/**
 * Get stock data from Polygon API
 */
export async function getStockData(
  ticker: string,
  timespan: string,
  multiplier: number,
  fromDate = "",
  toDate = "",
): Promise<StockData> {
  const polygonApiKey = process.env.POLYGON_API_KEY;

  if (!polygonApiKey) {
    return {
      meta: {
        ticker,
        timespan,
        multiplier,
        from_date: fromDate,
        to_date: toDate,
      },
      data: [],
      error: "Polygon API key not found in environment variables",
    };
  }

  try {
    // Initialize Polygon REST client
    const client = restClient(polygonApiKey);

    // Fetch aggregated data
    const aggs = await client.stocks.aggregates(
      ticker,
      multiplier,
      timespan,
      fromDate,
      toDate,
      {
        adjusted: true,
        sort: "asc",
        limit: 50000,
      },
    );

    // Transform the data into a structured format
    const transformedData: StockData = {
      meta: {
        ticker,
        timespan,
        multiplier,
        from_date: fromDate,
        to_date: toDate,
      },
      data: aggs.results
        ? aggs.results.map((agg) => ({
            timestamp: new Date(agg.t)
              .toISOString()
              .replace("T", " ")
              .substring(0, 19),
            open: agg.o,
            high: agg.h,
            low: agg.l,
            close: agg.c,
            volume: agg.v,
          }))
        : [],
    };

    return transformedData;
  } catch (error: any) {
    console.error(`Error fetching ${timespan} data for ${ticker}:`, error);
    return {
      meta: {
        ticker,
        timespan,
        multiplier,
        from_date: fromDate,
        to_date: toDate,
      },
      data: [],
      error: error.message || `Failed to fetch ${timespan} data`,
    };
  }
}

/**
 * Get daily stock data
 */
export async function getDailyStockData(ticker: string): Promise<StockData> {
  const today = new Date();
  const oneDayAgo = new Date(today);
  oneDayAgo.setDate(today.getDate() - 1);

  const fromDate = oneDayAgo.toISOString().split("T")[0];
  const toDate = today.toISOString().split("T")[0];

  return getStockData(ticker, "hour", 1, fromDate, toDate);
}

/**
 * Get weekly stock data
 */
export async function getWeeklyStockData(ticker: string): Promise<StockData> {
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);

  const fromDate = oneWeekAgo.toISOString().split("T")[0];
  const toDate = today.toISOString().split("T")[0];

  return getStockData(ticker, "day", 1, fromDate, toDate);
}

/**
 * Get monthly stock data
 */
export async function getMonthlyStockData(ticker: string): Promise<StockData> {
  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const fromDate = oneMonthAgo.toISOString().split("T")[0];
  const toDate = today.toISOString().split("T")[0];

  return getStockData(ticker, "day", 1, fromDate, toDate);
}

/**
 * Get six-month stock data
 */
export async function getSixMonthStockData(ticker: string): Promise<StockData> {
  const today = new Date();
  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  const fromDate = sixMonthsAgo.toISOString().split("T")[0];
  const toDate = today.toISOString().split("T")[0];

  return getStockData(ticker, "day", 1, fromDate, toDate);
}

/**
 * Get yearly stock data
 */
export async function getYearlyStockData(ticker: string): Promise<StockData> {
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const fromDate = oneYearAgo.toISOString().split("T")[0];
  const toDate = today.toISOString().split("T")[0];

  return getStockData(ticker, "day", 1, fromDate, toDate);
}

/**
 * Get five-year stock data
 */
export async function getFiveYearStockData(ticker: string): Promise<StockData> {
  const today = new Date();
  const fiveYearsAgo = new Date(today);
  fiveYearsAgo.setFullYear(today.getFullYear() - 5);

  const fromDate = fiveYearsAgo.toISOString().split("T")[0];
  const toDate = today.toISOString().split("T")[0];

  return getStockData(ticker, "month", 1, fromDate, toDate);
}
