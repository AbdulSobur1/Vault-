import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, twoFactorBackupCodes } from "@/lib/schema";
import { eq } from "drizzle-orm";
import {
  verifyTOTP,
  generateBackupCodes,
  hashBackupCodes,
} from "@/lib/two-factor";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const { token } = await req.json();
  if (!token) return Response.json({ error: "Token required" }, { status: 400 });

  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user?.totpSecret) return Response.json({ error: "TOTP not initiated" }, { status: 400 });

  const valid = await verifyTOTP(token, user.totpSecret);
  if (!valid) return Response.json({ error: "Invalid code. Try again." }, { status: 400 });

  const plainCodes = generateBackupCodes(8);
  const hashedCodes = await hashBackupCodes(plainCodes);

  await db.transaction(async (tx) => {
    await tx.update(users)
      .set({
        twoFactorEnabled: true,
        twoFactorMethod: "totp",
        twoFactorSetupComplete: true,
      })
      .where(eq(users.id, userId));

    await tx.delete(twoFactorBackupCodes)
      .where(eq(twoFactorBackupCodes.userId, userId));

    await tx.insert(twoFactorBackupCodes).values(
      hashedCodes.map((hash) => ({
        userId: userId,
        codeHash: hash,
      }))
    );
  });

  return Response.json({ success: true, backupCodes: plainCodes });
}
