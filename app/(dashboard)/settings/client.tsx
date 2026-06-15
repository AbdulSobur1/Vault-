"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { User, Shield, Settings as SettingsIcon, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { User as UserType } from "@/lib/schema";

interface SettingsClientProps {
  user: UserType;
}

const tabs = ["Profile", "Security", "Preferences"];

export function SettingsClient({ user }: SettingsClientProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("Profile");

  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFAMethod, setTwoFAMethod] = useState<string | null>(null);
  const [loading2FA, setLoading2FA] = useState(true);

  useEffect(() => {
    fetch("/api/2fa/status")
      .then(r => r.json())
      .then(d => {
        setTwoFAEnabled(d.enabled);
        setTwoFAMethod(d.method);
        setLoading2FA(false);
      })
      .catch(() => setLoading2FA(false));
  }, []);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Coming Soon",
      description: "Password change will be available in a future update.",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-medium">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">Manage your account settings</p>
      </div>

      {/* Tabs: horizontal scroll on mobile */}
      <div className="flex border-b border-[#2A2A2A] overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-4 py-2.5 text-sm border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "border-accent-gold text-white font-medium"
                : "border-transparent text-[#8A8682] hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "Profile" && (
        <div className="mt-6 space-y-4">
          <div>
            <h3 className="text-base font-medium text-white mb-1">Profile Information</h3>
            <p className="text-xs text-[#8A8682]">Your personal details</p>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Full Name', value: `${user.firstname} ${user.surname}` },
              { label: 'Email', value: user.email },
              { label: 'Phone', value: user.phone || '—' },
              { label: 'Date of Birth', value: user.dob || '—' },
              { label: 'Gender', value: user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : '—' },
              { label: 'Nationality', value: user.nationality || '—' },
              { label: 'Address', value: user.address || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="border border-[#2A2A2A] rounded-md px-4 py-3 bg-[#1C1C1C]">
                <p className="text-[10px] text-[#555250] uppercase tracking-wider mb-1">{label}</p>
                <p className="text-sm text-white">{value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-text-secondary">Profile editing will be available in a future update.</p>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "Security" && (
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-base font-medium text-white mb-1">Security Settings</h3>
            <p className="text-xs text-[#8A8682]">Manage your account security</p>
          </div>

          {/* Change Password */}
          <div className="border border-[#2A2A2A] rounded-xl p-5 space-y-4 bg-[#161616]">
            <h3 className="text-sm font-medium text-white">Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" placeholder="Enter current password" className="bg-[#1C1C1C]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="Enter new password" className="bg-[#1C1C1C]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" placeholder="Confirm new password" className="bg-[#1C1C1C]" />
              </div>
              <Button type="submit" variant="accent">Update Password</Button>
            </form>
          </div>

          {/* 2FA Section */}
          <div className="border border-[#2A2A2A] rounded-xl p-5 bg-[#161616]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center">
                  <Shield size={16} className="text-[#C9A84C]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                  <p className="text-xs text-[#555250] mt-0.5">
                    Add an extra layer of security to your account
                  </p>
                </div>
              </div>
              {loading2FA ? (
                <div className="h-8 w-16 rounded-md bg-[#1C1C1C] animate-pulse shrink-0" />
              ) : twoFAEnabled ? (
                <span className="flex items-center gap-1.5 text-xs text-[#4CAF82] bg-[#2D6A4F]/20 px-3 py-1 rounded-full shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF82]" />
                  Active
                </span>
              ) : (
                <Link href="/setup-2fa">
                  <button className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-[#C9A84C] text-[#0A0A0A] text-xs font-medium hover:bg-[#b8973d] transition-colors shrink-0">
                    Enable
                    <ChevronRight size={13} />
                  </button>
                </Link>
              )}
            </div>

            {twoFAEnabled && (
              <div className="space-y-3 mt-4 pl-12">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#8A8682]">Method: <span className="text-white capitalize">{twoFAMethod === "totp" ? "Authenticator App" : "SMS"}</span></p>
                  <Link href="/setup-2fa">
                    <button className="text-xs text-[#555250] hover:text-white transition-colors">Change method</button>
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#8A8682]">Backup codes</p>
                  <button className="text-xs text-[#555250] hover:text-white transition-colors">Regenerate</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === "Preferences" && (
        <div className="mt-6 space-y-4">
          <div>
            <h3 className="text-base font-medium text-white mb-1">Preferences</h3>
            <p className="text-xs text-[#8A8682]">Customize your experience</p>
          </div>
          <div className="border border-[#2A2A2A] rounded-xl p-5 bg-[#161616] space-y-4">
            <p className="text-sm font-medium text-white">Notification Preferences</p>
            <div className="space-y-3">
              {[
                { label: "Email Notifications", desc: "Receive account updates via email", defaultChecked: true },
                { label: "SMS Alerts", desc: "Get transaction alerts via SMS", defaultChecked: true },
                { label: "Marketing", desc: "Receive promotional offers and updates", defaultChecked: false },
              ].map(({ label, desc, defaultChecked }) => (
                <label key={label} className="flex items-center justify-between py-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white">{label}</p>
                    <p className="text-xs text-text-secondary">{desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked={defaultChecked} className="text-accent-gold focus:ring-accent-gold rounded shrink-0 ml-4" />
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
