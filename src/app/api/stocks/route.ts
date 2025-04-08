import { getLatestStockData } from "@/lib/financial-services";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ticker = searchParams.get("ticker");

  if (!ticker) {
    return NextResponse.json(
      { error: "ticker parameter is required" },
      { status: 400 },
    );
  }

  try {
    const latestData = await getLatestStockData(ticker.toUpperCase());

    return NextResponse.json(latestData);
  } catch (error: unknown) {
    console.error(`Error fetching data for ${ticker}:`, error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? (error.message ?? "Failed to fetch stock data")
            : "Failed to fetch stock data",
      },
      { status: 500 },
    );
  }
}
