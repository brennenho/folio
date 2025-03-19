import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email } = (await request.json()) as {
      name: string;
      email: string;
    };

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.SPREADSHEET_ID!;
    const range = "Waitlist!A:B";

    const resource = {
      values: [[name, email]],
    };

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: resource,
    });

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
