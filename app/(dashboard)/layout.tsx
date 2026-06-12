import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";

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
    <div className="min-h-screen bg-bg-base">
      <Sidebar user={user} />
      <Header user={user} />

      <main className="md:pl-60 pb-20 md:pb-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          {children}
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
