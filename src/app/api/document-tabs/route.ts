import { NextResponse } from "next/server";

export async function GET() {
  // In a real implementation, this would fetch from your FastAPI backend
  return NextResponse.json([{ id: "1", name: "Tab 1", active: true }]);
}

export async function POST(request: Request) {
  // In a real implementation, this would send to your FastAPI backend
  const data = await request.json();
  return NextResponse.json({ id: "2", name: data.name, active: false });
}
