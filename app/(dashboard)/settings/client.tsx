"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { User, Shield, Settings as SettingsIcon, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { User as UserType } from "@/lib/schema";

interface SettingsClientProps {
  user: UserType;
}

export function SettingsClient({ user }: SettingsClientProps) {
  const { toast } = useToast();

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

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" /> Preferences
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Surname</Label>
                  <Input value={user.surname} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={user.firstname} readOnly />
                </div>
              </div>
              {user.middlename && (
                <div className="space-y-2">
                  <Label>Middle Name</Label>
                  <Input value={user.middlename} readOnly />
                </div>
              )}
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user.email} readOnly />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={user.phone || "Not set"} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input value={user.dob || "Not set"} readOnly />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Input value={user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "Not set"} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Nationality</Label>
                  <Input value={user.nationality || "Not set"} readOnly />
                </div>
              </div>
              <div className="space-y-2">
                <Label>NIN</Label>
                <Input value={user.nin || "Not set"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={user.address || "Not set"} readOnly />
              </div>
              <p className="text-xs text-text-secondary">Profile editing will be available in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Change Password */}
              <div>
                <h3 className="text-sm font-medium mb-3">Change Password</h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" placeholder="Enter current password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" placeholder="Enter new password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                  </div>
                  <Button type="submit" variant="accent">Update Password</Button>
                </form>
              </div>

              {/* Separator */}
              <div className="border-t border-[#2A2A2A]" />

              {/* 2FA Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between py-4 border-b border-[#2A2A2A]">
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
                    <div className="h-8 w-16 rounded-md bg-[#1C1C1C] animate-pulse" />
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
                  <div className="space-y-3 pl-12">
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium mb-3">Notification Preferences</p>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Email Notifications</p>
                      <p className="text-xs text-text-secondary">Receive account updates via email</p>
                    </div>
                    <input type="checkbox" defaultChecked className="text-accent-gold focus:ring-accent-gold rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">SMS Alerts</p>
                      <p className="text-xs text-text-secondary">Get transaction alerts via SMS</p>
                    </div>
                    <input type="checkbox" defaultChecked className="text-accent-gold focus:ring-accent-gold rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Marketing</p>
                      <p className="text-xs text-text-secondary">Receive promotional offers and updates</p>
                    </div>
                    <input type="checkbox" className="text-accent-gold focus:ring-accent-gold rounded" />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
