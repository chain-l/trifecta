export async function fetchPriceData(
  coinId: string
): Promise<[number, number][] | null> {
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=365`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return data.prices;
  } catch (error) {
    console.error(`Error fetching data for ${coinId}:`, error);
    return null;
  }
}
