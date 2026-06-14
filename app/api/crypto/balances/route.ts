import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { cryptoWallets } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getETHBalance, getTokenBalance, parseNetwork } from '@/lib/crypto-wallet';
import { getCryptoPrices } from '@/lib/crypto-prices';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [wallet] = await db.select().from(cryptoWallets)
    .where(eq(cryptoWallets.userId, session.user.id));

  if (!wallet) return Response.json({ wallet: null, balances: [] });

  const network = parseNetwork(process.env.NEXT_PUBLIC_CRYPTO_NETWORK);

  const [ethBalance, usdtBalance, usdcBalance, prices] = await Promise.all([
    getETHBalance(wallet.address, network),
    getTokenBalance(wallet.address, 'USDT', network),
    getTokenBalance(wallet.address, 'USDC', network),
    getCryptoPrices(['ETH', 'USDT', 'USDC', 'BTC', 'BNB']),
  ]);

  const priceMap = Object.fromEntries(prices.map(p => [p.coin, p]));

  const balances = [
    {
      coin: 'ETH',
      balance: ethBalance,
      balanceUSD: parseFloat(ethBalance) * (priceMap['ETH']?.priceUSD ?? 0),
      price: priceMap['ETH'],
    },
    {
      coin: 'USDT',
      balance: usdtBalance,
      balanceUSD: parseFloat(usdtBalance) * (priceMap['USDT']?.priceUSD ?? 1),
      price: priceMap['USDT'],
    },
    {
      coin: 'USDC',
      balance: usdcBalance,
      balanceUSD: parseFloat(usdcBalance) * (priceMap['USDC']?.priceUSD ?? 1),
      price: priceMap['USDC'],
    },
  ];

  return Response.json({
    walletAddress: wallet.address,
    network,
    balances,
    prices,
  });
}
