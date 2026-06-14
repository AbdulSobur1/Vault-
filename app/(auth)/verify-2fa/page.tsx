"use client";

import { useState, useEffect, useCallback } from "react";
import { Shield, Smartphone, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

export default function Verify2FAPage() {
  const [method, setMethod] = useState<"totp" | "sms" | "backup">("totp");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Check if 2FA is actually set up — if not, redirect to setup
  useEffect(() => {
    const check2FAStatus = async () => {
      try {
        const res = await fetch("/api/2fa/method");
        const data = await res.json();
        if (data.method) setMethod(data.method);
        // If the user hasn't completed setup, the API won't return an error
        // but we should redirect if 2FA is not enabled
        const statusRes = await fetch("/api/2fa/status");
        const status = await statusRes.json();
        if (!status.setupComplete) {
          router.push("/setup-2fa");
          return;
        }
      } catch {
        // If we can't check, allow the page to load normally
      } finally {
        setChecking(false);
      }
    };
    check2FAStatus();
  }, [router]);

  const handleSendSMS = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/2fa/sms/send", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSmsSent(true);
        toast({ title: `Code sent to ${data.phone}` });
      } else {
        toast({ title: "Failed to send SMS", description: data.error, variant: "error" });
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, method }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        toast({ title: "Verification failed", description: data.error, variant: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-4">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#C9A84C]/10 flex items-center justify-center mx-auto">
            <Shield size={22} className="text-[#C9A84C]" />
          </div>
          <h1 className="text-xl font-semibold text-white">Two-factor verification</h1>
          <p className="text-sm text-[#8A8682]">
            {method === "totp"
              ? "Enter the code from your authenticator app."
              : method === "sms"
              ? "Enter the code sent to your phone."
              : "Enter one of your backup codes."}
          </p>
        </div>

        <div className="bg-[#161616] border border-[#2A2A2A] rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-center gap-2 text-sm text-[#8A8682]">
            {method === "totp" && <><Smartphone size={15} /> Authenticator app</>}
            {method === "sms" && <><MessageSquare size={15} /> SMS code</>}
          </div>

          {method === "sms" && !smsSent && (
            <button
              onClick={handleSendSMS}
              disabled={loading}
              className="w-full h-10 rounded-md border border-[#C9A84C]/40 text-[#C9A84C] text-sm hover:bg-[#C9A84C]/10 transition-colors"
            >
              {loading ? "Sending..." : "Send code to my phone"}
            </button>
          )}

          {(method === "totp" || smsSent || method === "backup") && (
            <>
              <input
                type="text"
                inputMode={method === "backup" ? "text" : "numeric"}
                maxLength={method === "backup" ? 9 : 6}
                placeholder={method === "backup" ? "XXXX-XXXX" : "000000"}
                value={code}
                onChange={(e) =>
                  setCode(
                    method === "backup"
                      ? e.target.value.toUpperCase()
                      : e.target.value.replace(/\D/g, "")
                  )
                }
                className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-md px-4 py-3 text-center text-2xl font-mono tracking-[0.4em] text-white focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
                autoFocus
              />
              <button
                onClick={handleVerify}
                disabled={!code || loading}
                className="w-full h-10 rounded-md bg-[#C9A84C] text-[#0A0A0A] text-sm font-medium hover:bg-[#b8973d] disabled:opacity-40 transition-colors"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </>
          )}

          {method === "sms" && smsSent && (
            <button
              onClick={handleSendSMS}
              className="w-full text-xs text-[#555250] hover:text-white transition-colors"
            >
              Resend code
            </button>
          )}

          {!showBackup && method !== "backup" && (
            <button
              onClick={() => {
                setShowBackup(true);
                setMethod("backup");
                setCode("");
              }}
              className="w-full text-xs text-[#555250] hover:text-[#8A8682] transition-colors"
            >
              Use a backup code instead
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
