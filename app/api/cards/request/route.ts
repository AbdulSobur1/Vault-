import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { cards, users } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { createSudoCustomer, createVirtualCard } from '@/lib/sudo-africa';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { currency = 'USD', spendingLimit } = await req.json();

  if (!['USD', 'NGN'].includes(currency)) {
    return Response.json({ error: 'Unsupported currency. Choose USD or NGN.' }, { status: 400 });
  }

  // Check if user already has an active card in this currency
  const [existingCard] = await db.select().from(cards)
    .where(and(
      eq(cards.userId, session.user.id),
      eq(cards.currency, currency),
      eq(cards.status, 'active')
    ));

  if (existingCard) {
    return Response.json({
      error: `You already have an active ${currency} virtual card.`
    }, { status: 409 });
  }

  // Fetch user details for Sudo customer creation
  const [user] = await db.select().from(users)
    .where(eq(users.id, session.user.id));

  if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

  try {
    // Step 1: Create Sudo customer (cardholder)
    const sudoCustomer = await createSudoCustomer({
      type: 'individual',
      name: `${user.firstname} ${user.surname}`,
      email: user.email,
      phoneNumber: user.phone ?? undefined,
      billingAddress: {
        line1: user.address ?? '1 Vaulté Street',
        city: 'Lagos',
        state: 'Lagos',
        country: 'NG',
        postalCode: '100001',
      },
    });

    // Step 2: Issue virtual card
    const sudoCard = await createVirtualCard(
      sudoCustomer._id,
      currency as 'USD' | 'NGN',
      spendingLimit
    );

    // Step 3: Save card record to DB (no sensitive data stored)
    const [newCard] = await db.insert(cards).values({
      userId: session.user.id,
      sudoCustomerId: sudoCustomer._id,
      sudoCardId: sudoCard._id,
      last4: sudoCard.last4,
      expiryMonth: sudoCard.expiryMonth,
      expiryYear: sudoCard.expiryYear,
      currency,
      brand: 'Visa',
      status: 'active',
      isActive: true,
      spendingLimitAmount: spendingLimit?.amount ? String(spendingLimit.amount) : null,
      spendingLimitInterval: spendingLimit?.interval ?? null,
    }).returning();

    return Response.json({
      success: true,
      card: {
        id: newCard.id,
        last4: newCard.last4,
        currency: newCard.currency,
        expiryMonth: newCard.expiryMonth,
        expiryYear: newCard.expiryYear,
        status: newCard.status,
      },
    });

  } catch (err: any) {
    console.error('Sudo card request error:', err);
    return Response.json({ error: err.message ?? 'Card issuance failed' }, { status: 502 });
  }
}
