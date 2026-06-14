import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = {
    name: session.user.name,
    email: session.user.email,
    firstname: session.user.firstname,
  };

  return (
    <div className="flex h-screen bg-[#0F0F0F] overflow-hidden">
      {/* Desktop sidebar — hidden on mobile */}
      <Sidebar user={user} />

      {/* Right side — takes remaining width, must not overflow */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header — no hamburger */}
        <Header user={user} />

        {/* Page content — bottom padding on mobile to clear bottom nav */}
        {/* pt-14 on mobile clears the fixed/sticky header area; pt-0 on desktop (header in flow) */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden pt-14 lg:pt-0 p-4 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation — hidden on desktop */}
      <BottomNav />
    </div>
  );
}
