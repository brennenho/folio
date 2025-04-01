import type { Components, StockData } from "@/components/chat/types";

export function extractTickers(components: Components[]): string[] {
  return components.flatMap((component) =>
    component.companies.map((company) => company.ticker),
  );
}

export async function fetchTickerData(ticker: string): Promise<StockData> {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${ticker}&apikey=${process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${ticker}`);
    }
    const data = await response.json();
    console.log(ticker, data);
    return {
      ...data,
    };
  } catch (error) {
    console.error(`Error fetching data for ${ticker}:`, error);
  }
  return {} as StockData;
}
