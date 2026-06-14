import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import {
  generateTOTPSecret,
  encryptTOTPSecret,
  generateTOTPQRCode,
} from "@/lib/two-factor";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const secret = generateTOTPSecret();
  const encryptedSecret = encryptTOTPSecret(secret);
  const qrCode = await generateTOTPQRCode(secret, user.email);

  await db.update(users)
    .set({ totpSecret: encryptedSecret })
    .where(eq(users.id, userId));

  return Response.json({ qrCode, secret });
}
