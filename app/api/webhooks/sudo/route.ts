import { db } from '@/lib/db';
import { cardTransactions, cards } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const body = await req.text();

  // Verify Authorization Token (Sudo sends this as Bearer token)
  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (!token || token !== process.env.SUDO_WEBHOOK_SECRET) {
    console.error('Sudo webhook: invalid or missing authorization token');
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse event
  let event: any;
  try {
    event = JSON.parse(body);
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (event.type === 'transaction.created' || event.type === 'transaction.updated') {
    const txn = event.data;

    // Find the internal card record
    const [card] = await db.select().from(cards)
      .where(eq(cards.sudoCardId, txn.card?._id ?? ''));

    if (card) {
      await db.insert(cardTransactions)
        .values({
          userId: card.userId,
          sudoCardId: card.sudoCardId!,
          sudoTransactionId: txn._id,
          type: txn.type,
          amount: String(txn.amount / 100), // convert from kobo/cents
          currency: txn.currency,
          merchant: txn.merchant?.name ?? null,
          category: txn.merchant?.category ?? null,
          status: txn.status,
        })
        .onConflictDoNothing(); // idempotent — ignore duplicate webhook events
    }
  }

  return Response.json({ received: true });
}
