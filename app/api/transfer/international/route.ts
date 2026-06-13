import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { currencyWallets, internationalTransfers } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { calculateConversion } from "@/lib/exchange-rates";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const {
    fromCurrency,
    toCurrency,
    fromAmount,
    recipientName,
    recipientBank,
    recipientAccount,
    recipientCountry,
    swiftCode,
    routingNumber,
    narration,
  } = await req.json();

  const parsedAmount = parseFloat(fromAmount);

  // Validate
  if (!recipientName || !recipientAccount || !recipientCountry) {
    return Response.json({ error: "Recipient details are required" }, { status: 400 });
  }
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return Response.json({ error: "Invalid amount" }, { status: 400 });
  }

  // Fetch source wallet
  const [sourceWallet] = await db
    .select()
    .from(currencyWallets)
    .where(
      and(
        eq(currencyWallets.userId, userId),
        eq(currencyWallets.currency, fromCurrency)
      )
    );

  if (!sourceWallet) return Response.json({ error: "Source wallet not found" }, { status: 404 });
  if (parseFloat(sourceWallet.balance) < parsedAmount) {
    return Response.json({ error: "Insufficient balance" }, { status: 400 });
  }

  const conversion = await calculateConversion(fromCurrency, toCurrency, parsedAmount);
  const reference = `VLT-INT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  await db.transaction(async (tx) => {
    // Debit source wallet
    await tx
      .update(currencyWallets)
      .set({ balance: String(parseFloat(sourceWallet.balance) - parsedAmount) })
      .where(eq(currencyWallets.id, sourceWallet.id));

    // Record international transfer
    await tx.insert(internationalTransfers).values({
      userId,
      fromCurrency,
      toCurrency,
      fromAmount: String(parsedAmount),
      toAmount: String(conversion.toAmount),
      exchangeRate: String(conversion.clientRate),
      recipientName,
      recipientBank: recipientBank || null,
      recipientAccount,
      recipientCountry,
      swiftCode: swiftCode || null,
      routingNumber: routingNumber || null,
      narration: narration || null,
      reference,
      status: "processing",
    });
  });

  return Response.json({
    success: true,
    reference,
    conversion,
    estimatedArrival: "1–3 business days",
    message: "Your international transfer is being processed.",
  });
}
