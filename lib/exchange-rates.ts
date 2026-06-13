import { SUPPORTED_CURRENCIES } from './currencies';

export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
}

export interface ConversionResult {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;           // amount received after spread
  midRate: number;            // raw interbank rate
  clientRate: number;         // rate shown to user (after spread)
  spreadAmount: number;       // fee in fromCurrency
  spreadRate: number;         // e.g. 0.015 = 1.5%
}

// Cache rates for 10 minutes to avoid hammering the API
const rateCache: Map<string, { rates: Record<string, number>; expiresAt: number }> = new Map();

export async function getExchangeRates(baseCurrency: string): Promise<Record<string, number>> {
  const cacheKey = baseCurrency;
  const cached = rateCache.get(cacheKey);

  if (cached && Date.now() < cached.expiresAt) {
    return cached.rates;
  }

  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  const apiUrl = process.env.EXCHANGE_RATE_API_URL;

  if (!apiKey) throw new Error('EXCHANGE_RATE_API_KEY not configured');

  const res = await fetch(`${apiUrl}/${apiKey}/latest/${baseCurrency}`, {
    next: { revalidate: 600 }, // Next.js cache: 10 minutes
  });

  if (!res.ok) throw new Error(`Exchange rate API error: ${res.status}`);

  const data = await res.json();

  if (data.result !== 'success') throw new Error('Exchange rate API returned error');

  const rates: Record<string, number> = {};

  // Only include supported currencies
  for (const currency of SUPPORTED_CURRENCIES) {
    if (data.conversion_rates[currency.code]) {
      rates[currency.code] = data.conversion_rates[currency.code];
    }
  }

  // Cache for 10 minutes
  rateCache.set(cacheKey, { rates, expiresAt: Date.now() + 10 * 60 * 1000 });

  return rates;
}

export async function calculateConversion(
  fromCurrency: string,
  toCurrency: string,
  fromAmount: number,
): Promise<ConversionResult> {
  const spread = parseFloat(process.env.VAULTE_FX_SPREAD ?? '0.015');

  if (fromCurrency === toCurrency) {
    return {
      fromCurrency,
      toCurrency,
      fromAmount,
      toAmount: fromAmount,
      midRate: 1,
      clientRate: 1,
      spreadAmount: 0,
      spreadRate: 0,
    };
  }

  const rates = await getExchangeRates(fromCurrency);
  const midRate = rates[toCurrency];

  if (!midRate) throw new Error(`Rate not available for ${toCurrency}`);

  // Apply spread: client gets a slightly worse rate than interbank
  const clientRate = midRate * (1 - spread);
  const toAmount = fromAmount * clientRate;
  const spreadAmount = fromAmount * spread; // fee in fromCurrency

  return {
    fromCurrency,
    toCurrency,
    fromAmount,
    toAmount: Math.round(toAmount * 1e8) / 1e8, // 8 decimal precision
    midRate,
    clientRate,
    spreadAmount: Math.round(spreadAmount * 1e8) / 1e8,
    spreadRate: spread,
  };
}
