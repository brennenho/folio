"use server";

import {
  getCompanyMetrics,
  getDailyStockData,
  getWeeklyStockData,
  getMonthlyStockData,
  getSixMonthStockData,
  getYearlyStockData,
  getFiveYearStockData,
  getLatestStockData,
  type CompanyMetrics,
  type StockData,
  type LatestStockData,
} from "@/lib/financial-services";

type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Server action to get company metrics
 */
export async function fetchCompanyMetrics(
  ticker: string,
): Promise<ActionResult<CompanyMetrics>> {
  try {
    const metrics = await getCompanyMetrics(ticker);

    if (metrics.error) {
      return {
        success: false,
        error: metrics.error,
      };
    }

    return { success: true, data: metrics };
  } catch (error: any) {
    console.error(`Error fetching metrics for ${ticker}:`, error);
    return {
      success: false,
      error: error.message || "Failed to fetch company metrics",
    };
  }
}

/**
 * Server action to get latest stock data
 */
export async function fetchLatestStockData(
  ticker: string,
): Promise<ActionResult<LatestStockData>> {
  try {
    const latestData = await getLatestStockData(ticker);

    if (latestData.error) {
      return {
        success: false,
        error: latestData.error,
      };
    }

    return { success: true, data: latestData };
  } catch (error: any) {
    console.error(`Error fetching latest data for ${ticker}:`, error);
    return {
      success: false,
      error: error.message || "Failed to fetch latest stock data",
    };
  }
}

/**
 * Server action to get stock data
 */
export async function fetchStockData(
  ticker: string,
  timeframe: string,
): Promise<ActionResult<StockData>> {
  try {
    let stockData: StockData;

    switch (timeframe) {
      case "daily":
        stockData = await getDailyStockData(ticker);
        break;
      case "weekly":
        stockData = await getWeeklyStockData(ticker);
        break;
      case "monthly":
        stockData = await getMonthlyStockData(ticker);
        break;
      case "six_month":
        stockData = await getSixMonthStockData(ticker);
        break;
      case "yearly":
        stockData = await getYearlyStockData(ticker);
        break;
      case "five_year":
        stockData = await getFiveYearStockData(ticker);
        break;
      default:
        stockData = await getDailyStockData(ticker);
    }

    if (stockData.error) {
      return {
        success: false,
        error: stockData.error,
      };
    }

    return { success: true, data: stockData };
  } catch (error: any) {
    console.error(`Error fetching ${timeframe} data for ${ticker}:`, error);
    return {
      success: false,
      error: error.message || `Failed to fetch ${timeframe} data`,
    };
  }
}
