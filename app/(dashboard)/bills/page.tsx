import { Smartphone, Zap, Wifi, Tv, GraduationCap, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const billCategories = [
  { icon: Smartphone, label: "Airtime",    desc: "Top up any network in 150+ countries",   soon: false },
  { icon: Wifi,       label: "Data",       desc: "Buy data bundles for any network",        soon: false },
  { icon: Zap,        label: "Electricity",desc: "Pay NEPA/BEDC/IKEDC prepaid meters",     soon: true  },
  { icon: Tv,         label: "Cable TV",   desc: "DSTV, GOtv, Startimes subscriptions",    soon: true  },
  { icon: GraduationCap, label: "Education", desc: "School fees, WAEC, JAMB payments",     soon: true  },
  { icon: ShoppingBag, label: "Shopping",  desc: "Pay merchants and online stores",         soon: true  },
];

export default async function BillsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Bills & Payments</h1>
        <p className="text-sm text-[#8A8682] mt-1">Pay bills and buy services instantly</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {billCategories.map(({ icon: Icon, label, desc, soon }) => (
          <div
            key={label}
            className={`relative rounded-xl border p-4 sm:p-5 flex flex-col gap-3 min-h-[120px] transition-colors ${
              soon
                ? "border-[#2A2A2A] bg-[#161616] opacity-60 cursor-not-allowed"
                : "border-[#2A2A2A] bg-[#161616] hover:border-[#C9A84C]/40 hover:bg-[#1C1C1C] cursor-pointer"
            }`}
          >
            {soon && (
              <span className="absolute top-3 right-3 text-[9px] font-medium text-[#C9A84C] border border-[#C9A84C]/30 rounded-full px-2 py-0.5">
                Soon
              </span>
            )}
            <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center">
              <Icon size={18} className="text-[#C9A84C]" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-[11px] text-[#555250] mt-0.5 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Coming soon notice */}
      <div className="rounded-xl border border-[#2A2A2A] bg-[#161616] p-5 text-center">
        <p className="text-sm text-white font-medium mb-1">More bill categories coming soon</p>
        <p className="text-xs text-[#555250]">
          Airtime and data top-ups are available now. Electricity, cable, and more are launching shortly.
        </p>
      </div>
    </div>
  );
}
