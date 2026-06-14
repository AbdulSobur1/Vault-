import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { cards } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { updateCardStatus, cancelCard } from '@/lib/sudo-africa';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { action } = await req.json(); // 'freeze' | 'unfreeze' | 'cancel'

  if (!action || !['freeze', 'unfreeze', 'cancel'].includes(action)) {
    return Response.json({ error: 'Invalid action' }, { status: 400 });
  }

  const [card] = await db.select().from(cards)
    .where(and(
      eq(cards.id, id),
      eq(cards.userId, session.user.id)
    ));

  if (!card || !card.sudoCardId) {
    return Response.json({ error: 'Card not found' }, { status: 404 });
  }

  try {
    if (action === 'cancel') {
      await cancelCard(card.sudoCardId);
      await db.update(cards)
        .set({ status: 'cancelled', isActive: false })
        .where(eq(cards.id, card.id));
      return Response.json({ success: true, status: 'cancelled' });
    }

    const sudoStatus = action === 'freeze' ? 'inactive' : 'active';
    await updateCardStatus(card.sudoCardId, sudoStatus);
    await db.update(cards)
      .set({ status: sudoStatus, isActive: action === 'unfreeze' })
      .where(eq(cards.id, card.id));

    return Response.json({ success: true, status: sudoStatus });
  } catch (err: any) {
    return Response.json({ error: err.message ?? 'Card update failed' }, { status: 502 });
  }
}
