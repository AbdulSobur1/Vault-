import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, smsOtpCodes, twoFactorBackupCodes, twoFactorSessions } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import {
  verifyTOTP,
  verifyOTPHash,
  verifyBackupCode,
  generate2FASessionToken,
} from "@/lib/two-factor";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { code, method } = await req.json();

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id));
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  let verified = false;

  if (method === "totp") {
    if (!user.totpSecret) return Response.json({ error: "TOTP not set up" }, { status: 400 });
    verified = await verifyTOTP(code, user.totpSecret);
  } else if (method === "sms") {
    const [otpRecord] = await db.select().from(smsOtpCodes)
      .where(and(eq(smsOtpCodes.userId, user.id), eq(smsOtpCodes.used, false)))
      .orderBy(smsOtpCodes.createdAt)
      .limit(1);

    if (!otpRecord || new Date() > otpRecord.expiresAt) {
      return Response.json({ error: "Code expired. Request a new one." }, { status: 400 });
    }
    if (otpRecord.attempts >= 5) {
      return Response.json({ error: "Too many attempts." }, { status: 429 });
    }

    await db.update(smsOtpCodes)
      .set({ attempts: otpRecord.attempts + 1 })
      .where(eq(smsOtpCodes.id, otpRecord.id));

    verified = await verifyOTPHash(code, otpRecord.codeHash);

    if (verified) {
      await db.update(smsOtpCodes)
        .set({ used: true })
        .where(eq(smsOtpCodes.id, otpRecord.id));
    }
  } else if (method === "backup") {
    const backupCodes = await db.select().from(twoFactorBackupCodes)
      .where(and(
        eq(twoFactorBackupCodes.userId, user.id),
        eq(twoFactorBackupCodes.used, false)
      ));

    const matchIndex = await verifyBackupCode(code, backupCodes.map((b) => b.codeHash));

    if (matchIndex >= 0) {
      verified = true;
      await db.update(twoFactorBackupCodes)
        .set({ used: true, usedAt: new Date() })
        .where(eq(twoFactorBackupCodes.id, backupCodes[matchIndex].id));
    }
  }

  if (!verified) {
    return Response.json({ error: "Invalid code. Try again." }, { status: 400 });
  }

  const token = generate2FASessionToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await db.insert(twoFactorSessions).values({
    userId: user.id,
    sessionToken: token,
    expiresAt,
    ipAddress: req.headers.get("x-forwarded-for") ?? null,
    userAgent: req.headers.get("user-agent") ?? null,
  });

  const cookieStore = await cookies();
  cookieStore.set("vaulte_2fa", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return Response.json({ success: true });
}
