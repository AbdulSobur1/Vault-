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
    <div className="min-h-screen bg-bg-base flex">
      {/* Desktop sidebar — hidden on mobile */}
      <Sidebar user={user} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header — no hamburger */}
        <Header user={user} />

        {/* Page content — bottom padding on mobile to clear bottom nav */}
        <main className="flex-1 p-4 lg:p-8 lg:pl-60 pb-20 lg:pb-8 overflow-x-hidden overflow-y-auto min-w-0">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation — hidden on desktop */}
      <BottomNav />
    </div>
  );
}
