import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { currencyWallets, cryptoWallets, cryptoFxTransactions } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { getConversionQuote } from '@/lib/crypto-conversion';
import { getETHBalance, getTokenBalance } from '@/lib/crypto-wallet';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { direction, coin, fiatCurrency, inputAmount } = await req.json();

  const parsedAmount = parseFloat(inputAmount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return Response.json({ error: 'Invalid amount' }, { status: 400 });
  }

  const userId: string = session.user.id;

  // Recalculate quote server-side — never trust client-side quote
  const quote = await getConversionQuote(direction, coin, fiatCurrency, parsedAmount);

  const reference = `VLT-CX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const network = (process.env.NEXT_PUBLIC_CRYPTO_NETWORK ?? 'sepolia') as 'mainnet' | 'sepolia';

  if (direction === 'buy') {
    // User pays fiat → receives crypto

    // 1. Check fiat wallet balance
    const [fiatWallet] = await db.select().from(currencyWallets)
      .where(and(
        eq(currencyWallets.userId, userId),
        eq(currencyWallets.currency, fiatCurrency)
      ));

    if (!fiatWallet) return Response.json({ error: 'Fiat wallet not found' }, { status: 404 });
    if (parseFloat(fiatWallet.balance) < quote.fiatAmount) {
      return Response.json({ error: 'Insufficient fiat balance' }, { status: 400 });
    }

    // 2. Get user's crypto wallet
    const [cryptoWallet] = await db.select().from(cryptoWallets)
      .where(eq(cryptoWallets.userId, userId));

    if (!cryptoWallet) return Response.json({ error: 'Crypto wallet not found' }, { status: 404 });

    // 3. Execute atomically
    await db.transaction(async (tx) => {
      // Debit fiat wallet
      await tx.update(currencyWallets)
        .set({ balance: String(parseFloat(fiatWallet.balance) - quote.fiatAmount) })
        .where(eq(currencyWallets.id, fiatWallet.id));

      // Record conversion
      await tx.insert(cryptoFxTransactions).values({
        userId,
        direction: 'buy',
        fiatCurrency,
        cryptoCoin: coin,
        fiatAmount: String(quote.fiatAmount),
        cryptoAmount: String(quote.cryptoAmount),
        pricePerCoinUSD: String(quote.pricePerCoinUSD),
        pricePerCoinFiat: String(quote.pricePerCoinFiat),
        spreadRate: String(quote.spreadRate),
        spreadAmountFiat: String(quote.spreadAmountFiat),
        reference,
        status: 'completed',
      });

      // NOTE: In a real implementation, you would now send crypto from a
      // Vaulté hot wallet to the user's wallet address on-chain.
      // For demo/MVP: record the credit internally — the crypto balance
      // is tracked in cryptoFxTransactions and shown as "Vaulté-custodied"
      // until on-chain settlement is implemented.
    });

    return Response.json({
      success: true,
      reference,
      direction: 'buy',
      paid: `${quote.fiatAmount.toFixed(2)} ${fiatCurrency}`,
      received: `${quote.cryptoAmount.toFixed(8)} ${coin}`,
      rate: `1 ${coin} = ${quote.clientPricePerCoinFiat.toFixed(2)} ${fiatCurrency}`,
    });

  } else {
    // User sells crypto → receives fiat

    // 1. Check on-chain crypto balance
    let onChainBalance: string;
    const [cryptoWallet] = await db.select().from(cryptoWallets)
      .where(eq(cryptoWallets.userId, userId));

    if (!cryptoWallet) return Response.json({ error: 'Crypto wallet not found' }, { status: 404 });

    if (coin === 'ETH') {
      onChainBalance = await getETHBalance(cryptoWallet.address, network);
    } else if (coin === 'USDT' || coin === 'USDC') {
      onChainBalance = await getTokenBalance(cryptoWallet.address, coin as 'USDT' | 'USDC', network);
    } else {
      return Response.json({ error: 'Unsupported coin for selling' }, { status: 400 });
    }

    if (parseFloat(onChainBalance) < quote.cryptoAmount) {
      return Response.json({ error: 'Insufficient crypto balance' }, { status: 400 });
    }

    // 2. Find or create fiat destination wallet
    let [fiatWallet] = await db.select().from(currencyWallets)
      .where(and(
        eq(currencyWallets.userId, userId),
        eq(currencyWallets.currency, fiatCurrency)
      ));

    if (!fiatWallet) {
      [fiatWallet] = await db.insert(currencyWallets).values({
        userId,
        currency: fiatCurrency,
        balance: '0',
      }).returning();
    }

    // 3. Execute atomically
    await db.transaction(async (tx) => {
      // Credit fiat wallet
      await tx.update(currencyWallets)
        .set({ balance: String(parseFloat(fiatWallet.balance) + quote.fiatAmount) })
        .where(eq(currencyWallets.id, fiatWallet.id));

      // Record conversion
      await tx.insert(cryptoFxTransactions).values({
        userId,
        direction: 'sell',
        fiatCurrency,
        cryptoCoin: coin,
        fiatAmount: String(quote.fiatAmount),
        cryptoAmount: String(quote.cryptoAmount),
        pricePerCoinUSD: String(quote.pricePerCoinUSD),
        pricePerCoinFiat: String(quote.pricePerCoinFiat),
        spreadRate: String(quote.spreadRate),
        spreadAmountFiat: String(quote.spreadAmountFiat),
        reference,
        status: 'completed',
      });
    });

    return Response.json({
      success: true,
      reference,
      direction: 'sell',
      paid: `${quote.cryptoAmount.toFixed(8)} ${coin}`,
      received: `${quote.fiatAmount.toFixed(2)} ${fiatCurrency}`,
      rate: `1 ${coin} = ${quote.clientPricePerCoinFiat.toFixed(2)} ${fiatCurrency}`,
    });
  }
}
