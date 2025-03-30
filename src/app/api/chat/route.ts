import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // In a real implementation, this would send to your FastAPI backend
  const { message } = await request.json();

  // This is just a placeholder - in production, you would call your FastAPI endpoint
  return NextResponse.json({
    response:
      "This is a placeholder response. In production, this would come from your FastAPI backend.",
  });
}
