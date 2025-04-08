import { type NextRequest, NextResponse } from "next/server";
import { getLatestStockData } from "@/lib/financial-services";

export async function GET(request: NextRequest) {
  console.log("Request received:", request.url);

  const searchParams = request.nextUrl.searchParams;
  const ticker = searchParams.get("ticker");

  console.log("ticker parameter:", ticker);

  if (!ticker) {
    console.log("ticker parameter is missing");
    return NextResponse.json(
      { error: "ticker parameter is required" },
      { status: 400 },
    );
  }

  try {
    console.log("Fetching data for ticker:", ticker);
    const latestData = await getLatestStockData(ticker.toUpperCase());
    console.log("Fetched data:", latestData);
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
