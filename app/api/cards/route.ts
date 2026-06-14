import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { cards } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const userCards = await db.select().from(cards)
    .where(eq(cards.userId, session.user.id))
    .orderBy(cards.createdAt);

  return Response.json({ cards: userCards });
}
