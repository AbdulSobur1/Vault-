// Binance public API — no authentication required
// Supported pairs: ETHUSDT, USDTUSDT (=1), USDCUSDT (≈1), BNBUSDT, BTCUSDT

const BINANCE_SYMBOLS: Record<string, string> = {
  ETH:  'ETHUSDT',
  BNB:  'BNBUSDT',
  BTC:  'BTCUSDT',
  // USDT and USDC are stablecoins — always ~$1
};

export interface BinancePrice {
  coin: string;
  priceUSD: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
}

// In-memory cache — 30 seconds (trade prices move fast)
const binanceCache = new Map<string, { data: BinancePrice; expiresAt: number }>();

export async function getBinancePrice(coin: string): Promise<BinancePrice> {
  // Stablecoins — always 1 USD
  if (coin === 'USDT' || coin === 'USDC') {
    return {
      coin,
      priceUSD: 1.0,
      change24h: 0,
      high24h: 1.001,
      low24h: 0.999,
      volume24h: 0,
    };
  }

  const cached = binanceCache.get(coin);
  if (cached && Date.now() < cached.expiresAt) return cached.data;

  const symbol = BINANCE_SYMBOLS[coin];
  if (!symbol) throw new Error(`Unsupported coin: ${coin}`);

  const res = await fetch(
    `${process.env.BINANCE_API_URL}/ticker/24hr?symbol=${symbol}`,
    { next: { revalidate: 30 } }
  );

  if (!res.ok) throw new Error(`Binance API error: ${res.status}`);

  const data = await res.json();

  const price: BinancePrice = {
    coin,
    priceUSD: parseFloat(data.lastPrice),
    change24h: parseFloat(data.priceChangePercent),
    high24h: parseFloat(data.highPrice),
    low24h: parseFloat(data.lowPrice),
    volume24h: parseFloat(data.volume),
  };

  binanceCache.set(coin, { data: price, expiresAt: Date.now() + 30_000 });
  return price;
}

export async function getBinancePrices(coins: string[]): Promise<BinancePrice[]> {
  return Promise.all(coins.map(getBinancePrice));
}

// Convert crypto price to fiat using existing FX rates
export async function getCryptoPriceInFiat(
  coin: string,
  fiatCurrency: string,
  usdToFiatRate: number // get this from existing ExchangeRate-API
): Promise<number> {
  const { priceUSD } = await getBinancePrice(coin);
  return priceUSD * usdToFiatRate;
}
