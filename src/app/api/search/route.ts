import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  // In a real implementation, this would fetch from your FastAPI backend
  // For now, just return an empty array
  return NextResponse.json([]);
}
