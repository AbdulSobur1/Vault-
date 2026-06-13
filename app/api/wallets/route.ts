import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { currencyWallets } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getExchangeRates } from "@/lib/exchange-rates";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const wallets = await db
    .select()
    .from(currencyWallets)
    .where(eq(currencyWallets.userId, session.user.id))
    .orderBy(currencyWallets.createdAt);

  // Get USD rates to show equivalent values
  let usdRates: Record<string, number> = {};
  try {
    usdRates = await getExchangeRates("USD");
  } catch {
    // Rates not available — skip USD equivalent
  }

  const walletsWithEquivalent = wallets.map((w) => ({
    ...w,
    balance: w.balance.toString(),
    balanceUSD: usdRates[w.currency]
      ? parseFloat(w.balance) / usdRates[w.currency]
      : null,
  }));

  return Response.json({ wallets: walletsWithEquivalent });
}
