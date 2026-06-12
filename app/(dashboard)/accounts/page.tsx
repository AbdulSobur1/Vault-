import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { accounts } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight } from "lucide-react";

export default async function AccountsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userAccounts = await db.query.accounts.findMany({
    where: eq(accounts.userId, session.user.id),
  });

  if (userAccounts.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-medium">Accounts</h1>
          <p className="text-sm text-muted mt-1">Manage your bank accounts</p>
        </div>
        <div className="rounded-lg border border-border bg-white dark:bg-dark-card dark:border-dark-border p-12 text-center">
          <Wallet className="h-12 w-12 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No accounts yet</h3>
          <p className="text-sm text-muted">Please contact support to open an account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-medium">Accounts</h1>
        <p className="text-sm text-muted mt-1">Manage your bank accounts</p>
      </div>

      <div className="grid gap-4">
        {userAccounts.map((account) => (
          <div
            key={account.id}
            className="rounded-lg border border-border bg-white dark:bg-dark-card dark:border-dark-border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-surface dark:bg-dark-surface shrink-0">
                <Wallet className="h-6 w-6 text-accent" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium capitalize">{account.accountType} Account</span>
                  <span className="text-xs text-muted font-mono">{account.accountNumber}</span>
                </div>
                <p className="text-2xl font-medium">{formatCurrency(parseFloat(account.balance))}</p>
                <p className="text-xs text-muted">{account.currency} • {account.isActive ? "Active" : "Inactive"}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/transactions?accountId=${account.id}`}>
                View Transactions <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
