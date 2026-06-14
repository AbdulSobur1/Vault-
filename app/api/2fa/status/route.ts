import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const [user] = await db.select({
    twoFactorSetupComplete: users.twoFactorSetupComplete,
    twoFactorEnabled: users.twoFactorEnabled,
    twoFactorMethod: users.twoFactorMethod,
  }).from(users).where(eq(users.id, session.user.id));

  return Response.json({
    setupComplete: user?.twoFactorSetupComplete ?? false,
    enabled: user?.twoFactorEnabled ?? false,
    method: user?.twoFactorMethod ?? null,
  });
}
