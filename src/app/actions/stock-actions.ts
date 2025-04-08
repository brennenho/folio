"use server";

import {
  type LatestStockData,
  getLatestStockData,
} from "@/lib/financial-services";

type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

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
  } catch (error: unknown) {
    console.error(`Error fetching latest data for ${ticker}:`, error);
    return {
      success: false,
      error:
        error instanceof Error
          ? (error.message ?? "Failed to fetch latest stock data")
          : "Failed to fetch latest stock data",
    };
  }
}
