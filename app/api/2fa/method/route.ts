import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const [user] = await db.select({
    twoFactorMethod: users.twoFactorMethod,
    twoFactorEnabled: users.twoFactorEnabled,
  }).from(users).where(eq(users.id, session.user.id));

  return Response.json({ method: user?.twoFactorMethod ?? "totp" });
}
