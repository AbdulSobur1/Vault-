import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { currencyWallets } from "@/lib/schema";
import { SUPPORTED_CURRENCIES } from "@/lib/currencies";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { currency } = await req.json();

  if (!SUPPORTED_CURRENCIES.find((c) => c.code === currency)) {
    return Response.json({ error: "Unsupported currency" }, { status: 400 });
  }

  try {
    const [wallet] = await db
      .insert(currencyWallets)
      .values({
        userId: session.user.id,
        currency,
        balance: "0",
      })
      .returning();

    return Response.json({ success: true, wallet });
  } catch (err: any) {
    // Unique constraint violation — wallet already exists
    if (err.code === "23505") {
      return Response.json({ error: "You already have a wallet for this currency" }, { status: 409 });
    }
    return Response.json({ error: "Failed to create wallet" }, { status: 500 });
  }
}
