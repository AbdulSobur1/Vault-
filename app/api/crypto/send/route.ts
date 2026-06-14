import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { cryptoWallets, cryptoTransactions } from '@/lib/schema';
import { eq, and, gte } from 'drizzle-orm';
import { sendETH, sendToken, getETHBalance, getTokenBalance, parseNetwork } from '@/lib/crypto-wallet';
import { getCryptoPrice } from '@/lib/crypto-prices';
import { ethers } from 'ethers';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { coin, toAddress, amount } = await req.json();

  if (!ethers.isAddress(toAddress)) {
    return Response.json({ error: 'Invalid wallet address' }, { status: 400 });
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return Response.json({ error: 'Invalid amount' }, { status: 400 });
  }

  // Rate limit: max 5 sends per user per hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentSends = await db.select()
    .from(cryptoTransactions)
    .where(
      and(
        eq(cryptoTransactions.userId, session.user.id),
        eq(cryptoTransactions.type, 'send'),
        gte(cryptoTransactions.createdAt, oneHourAgo)
      )
    );

  if (recentSends.length >= 5) {
    return Response.json({ error: 'Rate limit exceeded. Maximum 5 sends per hour.' }, { status: 429 });
  }

  const [wallet] = await db.select().from(cryptoWallets)
    .where(eq(cryptoWallets.userId, session.user.id));

  if (!wallet) return Response.json({ error: 'No crypto wallet found' }, { status: 404 });

  const network = parseNetwork(process.env.NEXT_PUBLIC_CRYPTO_NETWORK);

  let currentBalance: string;
  if (coin === 'ETH') {
    currentBalance = await getETHBalance(wallet.address, network);
  } else if (coin === 'USDT' || coin === 'USDC') {
    currentBalance = await getTokenBalance(wallet.address, coin, network);
  } else {
    return Response.json({ error: 'Unsupported coin for sending' }, { status: 400 });
  }

  if (parseFloat(currentBalance) < parsedAmount) {
    return Response.json({ error: 'Insufficient balance' }, { status: 400 });
  }

  const reference = `VLT-CRYPTO-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  try {
    let result: { txHash: string; blockExplorerUrl: string };

    if (coin === 'ETH') {
      result = await sendETH(wallet.encryptedPrivateKey, toAddress, amount, network);
    } else {
      result = await sendToken(wallet.encryptedPrivateKey, coin as 'USDT' | 'USDC', toAddress, amount, network);
    }

    const priceData = await getCryptoPrice(coin);
    const amountUSD = parsedAmount * (priceData?.priceUSD ?? 0);

    await db.insert(cryptoTransactions).values({
      userId: session.user.id,
      walletAddress: wallet.address,
      type: 'send',
      coin,
      amount: String(parsedAmount),
      amountUSD: String(amountUSD),
      toAddress,
      fromAddress: wallet.address,
      txHash: result.txHash,
      blockExplorerUrl: result.blockExplorerUrl,
      status: 'confirmed',
      network,
      reference,
      confirmedAt: new Date(),
    });

    return Response.json({
      success: true,
      txHash: result.txHash,
      blockExplorerUrl: result.blockExplorerUrl,
      reference,
    });
  } catch (err: any) {
    console.error('Crypto send error:', err);
    return Response.json({ error: err.message ?? 'Transaction failed' }, { status: 500 });
  }
}
