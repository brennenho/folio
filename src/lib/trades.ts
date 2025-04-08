export function getMarketStatus() {
  const now = new Date();
  const etOffset = -4; // EDT offset from UTC

  // convert current time to Eastern Time
  const etNow = new Date(
    now.getTime() + (now.getTimezoneOffset() + etOffset * 60) * 60000,
  );

  // get day of week (0 = Sunday, 6 = Saturday)
  const dayOfWeek = etNow.getDay();

  // get hours and mins
  const hours = etNow.getHours();
  const minutes = etNow.getMinutes();
  const currentTimeInMinutes = hours * 60 + minutes;

  // market hours: 9:30 AM to 4:00 PM ET
  const marketOpenMinutes = 9 * 60 + 30;
  const marketCloseMinutes = 16 * 60;

  const isOpen =
    currentTimeInMinutes >= marketOpenMinutes &&
    currentTimeInMinutes < marketCloseMinutes;

  if (dayOfWeek === 0 || dayOfWeek === 6 || !isOpen) {
    return {
      isOpen: false,
      closesIn: "",
    };
  } else {
    const minutesUntilClose = marketCloseMinutes - currentTimeInMinutes;
    const hoursUntilClose = Math.floor(minutesUntilClose / 60);
    const minsRemaining = minutesUntilClose % 60;

    return {
      isOpen: true,
      closesIn: `Closes in ${hoursUntilClose}hr, ${minsRemaining}min`,
    };
  }
}

export async function getStockPrice(ticker: string) {
  const response = await fetch("/api/stocks?ticker=" + ticker);
  if (!response.ok) {
    throw new Error("API request failed");
  }
  const data = await response.json();
  if (!data) {
    throw new Error("No data returned from API");
  }
  const stockPrice = data.dailyBar?.close || data.lastTrade?.price;
  if (!stockPrice) {
    throw new Error("No stock price available");
  }
  return stockPrice;
}
