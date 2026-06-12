import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { SettingsClient } from "./client";
import { SignOutButton } from "@/components/auth/SignOutButton";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <SettingsClient user={user} />

      {/* Sign out section — always visible on settings page */}
      <div className="border-t border-[#2A2A2A] pt-6 mt-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Sign Out</p>
            <p className="text-xs text-[#8A8682] mt-0.5">
              Sign out of your Vaulté account on this device
            </p>
          </div>
          <SignOutButton variant="settings" />
        </div>
      </div>
    </>
  );
}
