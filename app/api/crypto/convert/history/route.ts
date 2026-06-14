import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { cryptoFxTransactions } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const history = await db.select()
    .from(cryptoFxTransactions)
    .where(eq(cryptoFxTransactions.userId, session.user.id))
    .orderBy(desc(cryptoFxTransactions.createdAt))
    .limit(50);

  return Response.json({ history });
}
