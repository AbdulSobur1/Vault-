import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { cryptoWallets } from '@/lib/schema';
import { generateWallet } from '@/lib/crypto-wallet';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [existing] = await db.select().from(cryptoWallets)
    .where(eq(cryptoWallets.userId, session.user.id));

  if (existing) {
    return Response.json({ address: existing.address });
  }

  const { address, encryptedPrivateKey, encryptedMnemonic } = generateWallet();

  await db.insert(cryptoWallets).values({
    userId: session.user.id,
    address,
    encryptedPrivateKey,
    encryptedMnemonic,
    network: 'ethereum',
  });

  return Response.json({ success: true, address });
}
