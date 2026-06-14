export const runtime = 'nodejs';

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, smsOtpCodes } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { generateSMSOTP, hashOTP, sendSMSOTP } from "@/lib/two-factor";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { phoneNumber } = await req.json();

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id));
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const phone = phoneNumber ?? user.phone;
  if (!phone) return Response.json({ error: "No phone number on file" }, { status: 400 });

  const otp = generateSMSOTP();
  const otpHash = await hashOTP(otp);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await db.delete(smsOtpCodes).where(eq(smsOtpCodes.userId, session.user.id));
  await db.insert(smsOtpCodes).values({
    userId: session.user.id,
    codeHash: otpHash,
    expiresAt,
  });

  await sendSMSOTP(phone, otp);

  return Response.json({ success: true, phone: phone.slice(0, -4) + "****" });
}
