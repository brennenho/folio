interface StockData {
  "Meta Data": {
    "1. Information": string;
    "2. Symbol": string;
    "3. Last Refreshed": string;
    "4. Time Zone": string;
  };
  "Weekly Time Series": Record<
    string,
    {
      "1. open": string;
      "2. high": string;
      "3. low": string;
      "4. close": string;
      "5. volume": string;
    }
  >;
}

export async function fetchTickerData(ticker: string): Promise<StockData> {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_KEY}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${ticker}`);
    }
    const data = (await response.json()) as StockData;
    console.log(ticker, data);
    return {
      ...data,
    };
  } catch (error) {
    console.error(`Error fetching data for ${ticker}:`, error);
  }
  return {} as StockData;
}
