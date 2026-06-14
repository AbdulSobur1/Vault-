"use client";

import { useState } from "react";
import { Shield, Smartphone, MessageSquare, Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

type Method = "totp" | "sms";
type Step = "choose" | "totp-scan" | "totp-verify" | "sms-phone" | "sms-verify" | "backup-codes" | "done";

export default function Setup2FAPage() {
  const [method, setMethod] = useState<Method>("totp");
  const [step, setStep] = useState<Step>("choose");
  const [qrCode, setQrCode] = useState("");
  const [totpSecret, setTotpSecret] = useState("");
  const [token, setToken] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleChooseMethod = async (chosen: Method) => {
    setMethod(chosen);
    setLoading(true);
    try {
      if (chosen === "totp") {
        const res = await fetch("/api/2fa/setup/totp/initiate", { method: "POST" });
        const data = await res.json();
        setQrCode(data.qrCode);
        setTotpSecret(data.secret);
        setStep("totp-scan");
      } else {
        setStep("sms-phone");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTOTP = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/2fa/setup/totp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (res.ok) {
        setBackupCodes(data.backupCodes);
        setStep("backup-codes");
      } else {
        toast({ title: "Verification failed", description: data.error, variant: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendSMS = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/2fa/setup/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });
      const data = await res.json();
      if (res.ok) setStep("sms-verify");
      else toast({ title: "Failed to send SMS", description: data.error, variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySMS = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/2fa/setup/sms/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: smsCode, phoneNumber }),
      });
      const data = await res.json();
      if (res.ok) {
        setBackupCodes(data.backupCodes);
        setStep("backup-codes");
      } else {
        toast({ title: "Invalid code", description: data.error, variant: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyBackupCodes = async () => {
    await navigator.clipboard.writeText(backupCodes.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#C9A84C]/10 flex items-center justify-center mx-auto">
            <Shield size={22} className="text-[#C9A84C]" />
          </div>
          <h1 className="text-xl font-semibold text-white">Secure your account</h1>
          <p className="text-sm text-[#8A8682]">
            Two-factor authentication is required to access Vaulté.
          </p>
        </div>

        <div className="bg-[#161616] border border-[#2A2A2A] rounded-xl p-6 space-y-5">
          {step === "choose" && (
            <div className="space-y-4">
              <p className="text-sm text-[#8A8682]">Choose your verification method:</p>
              <div className="space-y-3">
                <button
                  onClick={() => handleChooseMethod("totp")}
                  disabled={loading}
                  className="w-full flex items-center gap-4 p-4 rounded-lg border border-[#2A2A2A] hover:border-[#C9A84C]/50 hover:bg-[#1C1C1C] transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center shrink-0">
                    <Smartphone size={18} className="text-[#C9A84C]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Authenticator App</p>
                    <p className="text-xs text-[#555250] mt-0.5">
                      Use Google Authenticator, Authy, or any TOTP app. Most secure.
                    </p>
                  </div>
                  <span className="ml-auto text-xs bg-[#C9A84C]/10 text-[#C9A84C] px-2 py-1 rounded-full">
                    Recommended
                  </span>
                </button>

                <button
                  onClick={() => handleChooseMethod("sms")}
                  disabled={loading}
                  className="w-full flex items-center gap-4 p-4 rounded-lg border border-[#2A2A2A] hover:border-[#C9A84C]/50 hover:bg-[#1C1C1C] transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#2A2A2A] flex items-center justify-center shrink-0">
                    <MessageSquare size={18} className="text-[#8A8682]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">SMS Text Message</p>
                    <p className="text-xs text-[#555250] mt-0.5">
                      Receive a 6-digit code via SMS to your phone number.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === "totp-scan" && (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-white mb-1">Scan this QR code</p>
                <p className="text-xs text-[#8A8682]">
                  Open Google Authenticator or Authy and scan the code below.
                </p>
              </div>
              {qrCode && (
                <div className="flex justify-center">
                  <div className="bg-white p-3 rounded-xl">
                    <img src={qrCode} alt="TOTP QR Code" className="w-44 h-44" />
                  </div>
                </div>
              )}
              <div className="bg-[#0F0F0F] rounded-lg p-3 space-y-1">
                <p className="text-[10px] text-[#555250] uppercase tracking-wider">Manual entry key</p>
                <p className="text-xs font-mono text-white break-all">{totpSecret}</p>
              </div>
              <button
                onClick={() => setStep("totp-verify")}
                className="w-full h-10 rounded-md bg-[#C9A84C] text-[#0A0A0A] text-sm font-medium hover:bg-[#b8973d] transition-colors"
              >
                I've scanned it — Continue
              </button>
            </div>
          )}

          {step === "totp-verify" && (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-white mb-1">Enter the 6-digit code</p>
                <p className="text-xs text-[#8A8682]">
                  Enter the code shown in your authenticator app to confirm setup.
                </p>
              </div>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-md px-4 py-3 text-center text-2xl font-mono tracking-[0.4em] text-white focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
              />
              <button
                onClick={handleVerifyTOTP}
                disabled={token.length !== 6 || loading}
                className="w-full h-10 rounded-md bg-[#C9A84C] text-[#0A0A0A] text-sm font-medium hover:bg-[#b8973d] disabled:opacity-40 transition-colors"
              >
                {loading ? "Verifying..." : "Verify & Activate"}
              </button>
            </div>
          )}

          {step === "sms-phone" && (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-white mb-1">Enter your phone number</p>
                <p className="text-xs text-[#8A8682]">
                  We'll send a 6-digit code to this number each time you log in.
                </p>
              </div>
              <input
                type="tel"
                placeholder="+2348012345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-md px-4 py-2.5 text-sm text-white placeholder-[#555250] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
              />
              <button
                onClick={handleSendSMS}
                disabled={!phoneNumber || loading}
                className="w-full h-10 rounded-md bg-[#C9A84C] text-[#0A0A0A] text-sm font-medium hover:bg-[#b8973d] disabled:opacity-40 transition-colors"
              >
                {loading ? "Sending..." : "Send Code"}
              </button>
            </div>
          )}

          {step === "sms-verify" && (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-white mb-1">Enter the code</p>
                <p className="text-xs text-[#8A8682]">
                  We sent a 6-digit code to {phoneNumber}. Valid for 10 minutes.
                </p>
              </div>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-md px-4 py-3 text-center text-2xl font-mono tracking-[0.4em] text-white focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
              />
              <button
                onClick={handleVerifySMS}
                disabled={smsCode.length !== 6 || loading}
                className="w-full h-10 rounded-md bg-[#C9A84C] text-[#0A0A0A] text-sm font-medium hover:bg-[#b8973d] disabled:opacity-40 transition-colors"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
              <button
                onClick={handleSendSMS}
                className="w-full text-xs text-[#555250] hover:text-white transition-colors"
              >
                Didn't receive it? Resend code
              </button>
            </div>
          )}

          {step === "backup-codes" && (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-white mb-1">Save your backup codes</p>
                <p className="text-xs text-[#E05252]">
                  ⚠️ These codes will not be shown again. Save them somewhere safe.
                  Each code can only be used once.
                </p>
              </div>
              <div className="bg-[#0F0F0F] rounded-xl p-4 grid grid-cols-2 gap-2">
                {backupCodes.map((code, i) => (
                  <div key={i} className="font-mono text-sm text-white text-center py-1.5 bg-[#161616] rounded-md border border-[#2A2A2A]">
                    {code}
                  </div>
                ))}
              </div>
              <button
                onClick={handleCopyBackupCodes}
                className="w-full flex items-center justify-center gap-2 h-9 rounded-md border border-[#2A2A2A] text-sm text-[#8A8682] hover:text-white hover:bg-[#1C1C1C] transition-colors"
              >
                {copied ? <><Check size={14} className="text-[#4CAF82]" /> Copied!</> : <><Copy size={14} /> Copy all codes</>}
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full h-10 rounded-md bg-[#C9A84C] text-[#0A0A0A] text-sm font-medium hover:bg-[#b8973d] transition-colors"
              >
                I've saved my codes — Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
