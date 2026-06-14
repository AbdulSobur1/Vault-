import { auth } from '@/lib/auth';
import { getCryptoPrices } from '@/lib/crypto-prices';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const prices = await getCryptoPrices();
  return Response.json({ prices, timestamp: Date.now() });
}
