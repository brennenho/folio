import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "query parameter is required" },
      { status: 400 },
    );
  }

  try {
    // You'll need to use your Polygon API key here
    const apiKey = process.env.POLYGON_API_KEY;
    const url = `https://api.polygon.io/v3/reference/tickers?search=${encodeURIComponent(
      query,
    )}&active=true&market=stocks&limit=10&apiKey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    return NextResponse.json(data.results || []);
  } catch (error) {
    console.error("Error searching tickers:", error);
    return NextResponse.json(
      { error: "Failed to search stock tickers" },
      { status: 500 },
    );
  }
}
