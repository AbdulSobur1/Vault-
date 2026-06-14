import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, smsOtpCodes } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { generateSMSOTP, hashOTP, sendSMSOTP } from "@/lib/two-factor";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user?.phone) return Response.json({ error: "No phone number on file" }, { status: 400 });

  const otp = generateSMSOTP();
  const otpHash = await hashOTP(otp);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await db.delete(smsOtpCodes).where(eq(smsOtpCodes.userId, userId));
  await db.insert(smsOtpCodes).values({
    userId: userId,
    codeHash: otpHash,
    expiresAt,
  });

  await sendSMSOTP(user.phone, otp);

  return Response.json({
    success: true,
    phone: user.phone.slice(0, -4) + "****",
  });
}
