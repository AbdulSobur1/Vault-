import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { cards } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { revealCardDetails } from '@/lib/sudo-africa';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  // Verify card belongs to this user
  const [card] = await db.select().from(cards)
    .where(and(
      eq(cards.id, id),
      eq(cards.userId, session.user.id)
    ));

  if (!card) return Response.json({ error: 'Card not found' }, { status: 404 });
  if (!card.sudoCardId) return Response.json({ error: 'Card not yet issued' }, { status: 400 });

  try {
    const details = await revealCardDetails(card.sudoCardId);

    // Return sensitive details — they will be shown ONCE and never stored
    return Response.json({
      number: details.number,     // full 16-digit PAN
      cvv: details.cvv,
      expiryMonth: details.expiryMonth,
      expiryYear: details.expiryYear,
      last4: card.last4,
      currency: card.currency,
    });
  } catch (err: any) {
    return Response.json({ error: 'Could not retrieve card details' }, { status: 502 });
  }
}
