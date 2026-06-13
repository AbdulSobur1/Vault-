import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { accounts } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TransferClient } from "./client";

export default async function TransferPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userAccounts = await db.query.accounts.findMany({
    where: eq(accounts.userId, session.user.id),
  });

  if (userAccounts.length === 0) {
    redirect("/login");
  }

  const serializedAccounts = userAccounts.map((a) => ({
    ...a,
    balance: a.balance.toString(),
  }));

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex border-b border-[#2A2A2A] mb-6">
        <Link
          href="/transfer"
          className="px-4 py-2.5 text-sm border-b-2 transition-colors border-[#C9A84C] text-white"
        >
          Local Transfer
        </Link>
        <Link
          href="/transfer/international"
          className="px-4 py-2.5 text-sm border-b-2 transition-colors border-transparent text-[#8A8682] hover:text-white"
        >
          International Transfer
        </Link>
      </div>
      <TransferClient accounts={serializedAccounts} />
    </div>
  );
}
