import { auth } from "@/lib/auth";
import { calculateConversion } from "@/lib/exchange-rates";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") ?? "USD";
  const to = searchParams.get("to") ?? "NGN";
  const amount = parseFloat(searchParams.get("amount") ?? "0");

  if (isNaN(amount) || amount <= 0) {
    return Response.json({ error: "Invalid amount" }, { status: 400 });
  }

  try {
    const result = await calculateConversion(from, to, amount);
    return Response.json(result);
  } catch (err) {
    return Response.json({ error: "Conversion failed" }, { status: 502 });
  }
}
