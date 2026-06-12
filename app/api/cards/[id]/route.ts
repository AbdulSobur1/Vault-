import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cards } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { action } = await req.json();

    if (!action || !["freeze", "unfreeze", "cancel"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (action === "cancel") {
      await db
        .update(cards)
        .set({ isActive: false })
        .where(and(eq(cards.id, id), eq(cards.userId, session.user.id)));
    } else {
      const isActive = action === "unfreeze";
      await db
        .update(cards)
        .set({ isActive })
        .where(and(eq(cards.id, id), eq(cards.userId, session.user.id)));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Card update error:", error);
    return NextResponse.json({ error: "Failed to update card" }, { status: 500 });
  }
}
