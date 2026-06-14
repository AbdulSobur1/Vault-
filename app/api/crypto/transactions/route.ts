import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { cryptoTransactions } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const txns = await db.select().from(cryptoTransactions)
    .where(eq(cryptoTransactions.userId, session.user.id))
    .orderBy(desc(cryptoTransactions.createdAt))
    .limit(50);

  return Response.json({ transactions: txns });
}
