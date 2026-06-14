const COINGECKO_IDS: Record<string, string> = {
  BTC:  'bitcoin',
  ETH:  'ethereum',
  USDT: 'tether',
  USDC: 'usd-coin',
  BNB:  'binancecoin',
  SOL:  'solana',
  MATIC:'matic-network',
  ADA:  'cardano',
};

export interface CryptoPrice {
  coin: string;
  priceUSD: number;
  change24h: number;
  marketCap: number;
  sparkline7d: number[];
}

const priceCache = new Map<string, { data: CryptoPrice[]; expiresAt: number }>();

export async function getCryptoPrices(coins: string[] = Object.keys(COINGECKO_IDS)): Promise<CryptoPrice[]> {
  const cacheKey = coins.sort().join(',');
  const cached = priceCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) return cached.data;

  const ids = coins
    .map(c => COINGECKO_IDS[c])
    .filter(Boolean)
    .join(',');

  const url = `${process.env.COINGECKO_API_URL}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`;

  const headers: Record<string, string> = { 'Accept': 'application/json' };
  if (process.env.COINGECKO_API_KEY) {
    headers['x-cg-pro-api-key'] = process.env.COINGECKO_API_KEY;
  }

  const res = await fetch(url, { headers, next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);

  const data = await res.json();

  const prices: CryptoPrice[] = data.map((item: any) => {
    const coin = Object.entries(COINGECKO_IDS).find(([, id]) => id === item.id)?.[0] ?? item.symbol.toUpperCase();
    return {
      coin,
      priceUSD: item.current_price,
      change24h: item.price_change_percentage_24h ?? 0,
      marketCap: item.market_cap ?? 0,
      sparkline7d: item.sparkline_in_7d?.price ?? [],
    };
  });

  priceCache.set(cacheKey, { data: prices, expiresAt: Date.now() + 5 * 60 * 1000 });
  return prices;
}

export async function getCryptoPrice(coin: string): Promise<CryptoPrice | null> {
  const prices = await getCryptoPrices([coin]);
  return prices.find(p => p.coin === coin) ?? null;
}
