import { db } from '@/lib/db';
import { cardTransactions, cards } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('x-sudo-signature') ?? '';

  // Verify webhook signature
  const expectedSig = crypto
    .createHmac('sha256', process.env.SUDO_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');

  if (signature !== expectedSig) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);

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
