import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { transactions, accounts, users } from '@/lib/schema';
import { eq, and, ne } from 'drizzle-orm';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch the transaction
  const [txn] = await db
    .select()
    .from(transactions)
    .where(eq(transactions.id, params.id));

  if (!txn) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Verify the transaction belongs to the user
  const [account] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.id, txn.accountId));

  if (!account || account.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Try to find counterparty from same reference (opposite leg of transfer)
  const counterpartyTxns = await db
    .select({
      accountNumber: accounts.accountNumber,
      accountType: accounts.accountType,
      firstName: users.firstname,
      surname: users.surname,
    })
    .from(transactions)
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .innerJoin(users, eq(accounts.userId, users.id))
    .where(
      and(
        eq(transactions.reference, txn.reference),
        ne(transactions.id, txn.id)
      )
    )
    .limit(2);

  // The counterparty is the other transaction with the same reference
  // but belonging to a different account
  const counterparty = counterpartyTxns.length > 0 && counterpartyTxns[0].accountNumber !== account.accountNumber
    ? counterpartyTxns[0]
    : null;

  return NextResponse.json({
    ...txn,
    accountNumber: account.accountNumber,
    accountType: account.accountType,
    counterpartyName: counterparty
      ? `${counterparty.firstName} ${counterparty.surname}`
      : null,
    counterpartyAccount: counterparty?.accountNumber ?? null,
  });
}
