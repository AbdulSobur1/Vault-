import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, smsOtpCodes, twoFactorBackupCodes } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import {
  verifyOTPHash,
  generateBackupCodes,
  hashBackupCodes,
} from "@/lib/two-factor";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const { code, phoneNumber } = await req.json();

  const [otpRecord] = await db.select().from(smsOtpCodes)
    .where(and(
      eq(smsOtpCodes.userId, userId),
      eq(smsOtpCodes.used, false)
    ))
    .orderBy(smsOtpCodes.createdAt)
    .limit(1);

  if (!otpRecord) return Response.json({ error: "No OTP found. Request a new code." }, { status: 400 });
  if (new Date() > otpRecord.expiresAt) return Response.json({ error: "Code expired. Request a new one." }, { status: 400 });
  if (otpRecord.attempts >= 5) return Response.json({ error: "Too many attempts. Request a new code." }, { status: 429 });

  await db.update(smsOtpCodes)
    .set({ attempts: otpRecord.attempts + 1 })
    .where(eq(smsOtpCodes.id, otpRecord.id));

  const valid = await verifyOTPHash(code, otpRecord.codeHash);
  if (!valid) return Response.json({ error: "Invalid code. Try again." }, { status: 400 });

  await db.update(smsOtpCodes)
    .set({ used: true })
    .where(eq(smsOtpCodes.id, otpRecord.id));

  const plainCodes = generateBackupCodes(8);
  const hashedCodes = await hashBackupCodes(plainCodes);

  await db.transaction(async (tx) => {
    await tx.update(users)
      .set({
        phone: phoneNumber ?? undefined,
        phoneVerified: true,
        twoFactorEnabled: true,
        twoFactorMethod: "sms",
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
