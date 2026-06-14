import { getBinancePrice } from './binance-prices';
import { getExchangeRates } from './exchange-rates';

const SPREAD = parseFloat(process.env.VAULTE_CRYPTO_SPREAD ?? '0.015');

export interface CryptoConversionQuote {
  direction: 'buy' | 'sell';
  coin: string;
  fiatCurrency: string;

  // Amounts
  fiatAmount: number;
  cryptoAmount: number;

  // Rates
  pricePerCoinUSD: number;
  pricePerCoinFiat: number;       // price in the user's chosen fiat
  clientPricePerCoinFiat: number; // price after spread applied

  // Fee
  spreadRate: number;
  spreadAmountFiat: number;

  // Summary
  youPay: number;                 // what leaves user's wallet
  youReceive: number;             // what enters user's wallet
  youPayCurrency: string;
  youReceiveCurrency: string;
}

export async function getConversionQuote(
  direction: 'buy' | 'sell',
  coin: string,
  fiatCurrency: string,
  inputAmount: number,            // fiat amount if buying, crypto amount if selling
): Promise<CryptoConversionQuote> {

  // Get USD price of crypto from Binance
  const { priceUSD } = await getBinancePrice(coin);

  // Get fiat/USD exchange rate
  const usdRates = await getExchangeRates('USD');
  const usdToFiat = usdRates[fiatCurrency] ?? 1;
  const pricePerCoinFiat = priceUSD * usdToFiat;

  let fiatAmount: number;
  let cryptoAmount: number;
  let spreadAmountFiat: number;
  let clientPricePerCoinFiat: number;

  if (direction === 'buy') {
    // User pays fiatAmount, receives cryptoAmount
    // Apply spread: user gets LESS crypto (worse rate)
    fiatAmount = inputAmount;
    spreadAmountFiat = fiatAmount * SPREAD;
    const fiatAfterSpread = fiatAmount - spreadAmountFiat;
    cryptoAmount = fiatAfterSpread / pricePerCoinFiat;
    clientPricePerCoinFiat = fiatAmount / cryptoAmount; // effective rate paid

    return {
      direction,
      coin,
      fiatCurrency,
      fiatAmount,
      cryptoAmount,
      pricePerCoinUSD: priceUSD,
      pricePerCoinFiat,
      clientPricePerCoinFiat,
      spreadRate: SPREAD,
      spreadAmountFiat,
      youPay: fiatAmount,
      youReceive: cryptoAmount,
      youPayCurrency: fiatCurrency,
      youReceiveCurrency: coin,
    };

  } else {
    // User sells cryptoAmount, receives fiatAmount
    // Apply spread: user gets LESS fiat (worse rate)
    cryptoAmount = inputAmount;
    const grossFiat = cryptoAmount * pricePerCoinFiat;
    spreadAmountFiat = grossFiat * SPREAD;
    fiatAmount = grossFiat - spreadAmountFiat;
    clientPricePerCoinFiat = fiatAmount / cryptoAmount; // effective rate received

    return {
      direction,
      coin,
      fiatCurrency,
      fiatAmount,
      cryptoAmount,
      pricePerCoinUSD: priceUSD,
      pricePerCoinFiat,
      clientPricePerCoinFiat,
      spreadRate: SPREAD,
      spreadAmountFiat,
      youPay: cryptoAmount,
      youReceive: fiatAmount,
      youPayCurrency: coin,
      youReceiveCurrency: fiatCurrency,
    };
  }
}
