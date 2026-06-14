import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { transactions, accounts, users } from '@/lib/schema';
import { eq, and, ne } from 'drizzle-orm';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Fetch the transaction
  const [txn] = await db
    .select()
    .from(transactions)
    .where(eq(transactions.id, id));

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

  // Fetch this account's owner info
  const [currentUser] = await db
    .select({
      firstname: users.firstname,
      surname: users.surname,
      middlename: users.middlename,
    })
    .from(users)
    .where(eq(users.id, account.userId));

  const formatName = (first: string, middle: string | null, last: string) =>
    [first, middle, last].filter(Boolean).join(' ');

  // Find counterparty by same reference (opposite leg of transfer)
  const counterpartyTxns = await db
    .select({
      accountNumber: accounts.accountNumber,
      accountType: accounts.accountType,
      firstName: users.firstname,
      surname: users.surname,
      middlename: users.middlename,
    })
    .from(transactions)
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .innerJoin(users, eq(accounts.userId, users.id))
    .where(
      and(
        eq(transactions.reference, txn.reference),
        ne(transactions.id, txn.id),
        ne(accounts.id, txn.accountId)
      )
    )
    .limit(2);

  const counterparty = counterpartyTxns.length > 0 ? counterpartyTxns[0] : null;

  // Build sender/recipient based on transaction type
  const isSender = txn.type === 'debit';

  const currentParty = {
    name: formatName(currentUser?.firstname ?? '', currentUser?.middlename ?? null, currentUser?.surname ?? ''),
    accountNumber: account.accountNumber,
    accountType: account.accountType,
    bank: 'Vaulté',
  };

  const counterpartyParty = counterparty ? {
    name: formatName(counterparty.firstName, counterparty.middlename ?? null, counterparty.surname),
    accountNumber: counterparty.accountNumber,
    accountType: counterparty.accountType,
    bank: 'Vaulté',
  } : null;

  const sender = isSender ? currentParty : counterpartyParty;
  const recipient = isSender ? counterpartyParty : currentParty;

  return NextResponse.json({
    ...txn,
    sender,
    recipient,
    // Keep legacy fields for backward compat
    accountNumber: account.accountNumber,
    accountType: account.accountType,
    counterpartyName: counterparty
      ? `${counterparty.firstName} ${counterparty.surname}`
      : null,
    counterpartyAccount: counterparty?.accountNumber ?? null,
  });
}
