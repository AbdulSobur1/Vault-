import { auth } from "@/lib/auth";
import { getExchangeRates } from "@/lib/exchange-rates";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const base = searchParams.get("base") ?? "USD";

  try {
    const rates = await getExchangeRates(base);
    return Response.json({ base, rates, timestamp: Date.now() });
  } catch (err) {
    return Response.json({ error: "Failed to fetch rates" }, { status: 502 });
  }
}
