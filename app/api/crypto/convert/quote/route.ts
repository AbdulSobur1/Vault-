import { auth } from '@/lib/auth';
import { getConversionQuote } from '@/lib/crypto-conversion';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const direction = searchParams.get('direction') as 'buy' | 'sell';
  const coin = searchParams.get('coin') ?? 'ETH';
  const fiatCurrency = searchParams.get('fiat') ?? 'NGN';
  const amount = parseFloat(searchParams.get('amount') ?? '0');

  if (!['buy', 'sell'].includes(direction)) {
    return Response.json({ error: 'Invalid direction' }, { status: 400 });
  }
  if (isNaN(amount) || amount <= 0) {
    return Response.json({ error: 'Invalid amount' }, { status: 400 });
  }

  try {
    const quote = await getConversionQuote(direction, coin, fiatCurrency, amount);
    return Response.json(quote);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 502 });
  }
}
