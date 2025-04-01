import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { tickers } = (await request.json()) as {
      tickers: string[];
    };

    console.log(tickers);

    return NextResponse.json(
      { message: "Data saved successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
