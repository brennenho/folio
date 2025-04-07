import { type NextRequest, NextResponse } from "next/server";
import {
  getCompanyMetrics,
  getDailyStockData,
  getWeeklyStockData,
  getMonthlyStockData,
  getYearlyStockData,
  getSixMonthStockData,
  getFiveYearStockData,
  getLatestStockData,
} from "@/lib/financial-services";

export async function GET(
  request: NextRequest,
  { params }: { params: { ticker: string } },
) {
  const ticker = params.ticker.toUpperCase();
  const searchParams = request.nextUrl.searchParams;
  const timeframe = searchParams.get("timeframe") || "daily";

  try {
    // Get company metrics
    if (timeframe === "metrics") {
      const metrics = await getCompanyMetrics(ticker);
      return NextResponse.json(metrics);
    }

    // Get latest stock data
    if (timeframe === "latest") {
      const latestData = await getLatestStockData(ticker);
      return NextResponse.json(latestData);
    }

    // Get stock data based on timeframe
    let stockData;
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
      case "yearly":
        stockData = await getYearlyStockData(ticker);
        break;
      case "six_month":
        stockData = await getSixMonthStockData(ticker);
        break;
      case "five_year":
        stockData = await getFiveYearStockData(ticker);
        break;
      default:
        stockData = await getDailyStockData(ticker);
    }

    return NextResponse.json(stockData);
  } catch (error: any) {
    console.error(`Error fetching data for ${ticker}:`, error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch stock data" },
      { status: 500 },
    );
  }
}
