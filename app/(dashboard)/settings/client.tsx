"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { User, Shield, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";
import type { User as UserType } from "@/lib/schema";

interface SettingsClientProps {
  user: UserType;
}

export function SettingsClient({ user }: SettingsClientProps) {
  const { toast } = useToast();

  const userTwoFactorMethod = user.twoFactorMethod;
  const twoFactorEnabled = user.twoFactorEnabled;

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

              {/* 2FA Status */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Two-Factor Authentication</h3>

                <div className="flex items-center justify-between py-4 border-b border-[#2A2A2A]">
                  <div>
                    <p className="text-sm font-medium text-white">Status</p>
                    <p className="text-xs text-[#8A8682] mt-0.5">
                      {twoFactorEnabled
                        ? `Currently using: ${userTwoFactorMethod === "totp" ? "Authenticator App" : "SMS"}`
                        : "Not enabled"}
                    </p>
                  </div>
                  {twoFactorEnabled ? (
                    <span className="flex items-center gap-1.5 text-xs text-[#4CAF82] bg-[#2D6A4F]/20 px-3 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF82]" />
                      Active
                    </span>
                  ) : (
                    <Link href="/setup-2fa">
                      <Button variant="accent" size="sm">Enable 2FA</Button>
                    </Link>
                  )}
                </div>

                {twoFactorEnabled && (
                  <>
                    {/* Switch method */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white">Switch 2FA method</p>
                        <p className="text-xs text-[#555250] mt-0.5">Change between authenticator app and SMS</p>
                      </div>
                      <Link href="/setup-2fa">
                        <button className="h-8 px-3 rounded-md border border-[#2A2A2A] text-xs text-[#8A8682] hover:text-white hover:bg-[#1C1C1C] transition-colors">
                          Change method
                        </button>
                      </Link>
                    </div>

                    {/* Regenerate backup codes */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white">Backup codes</p>
                        <p className="text-xs text-[#555250] mt-0.5">Generate new backup codes (invalidates old ones)</p>
                      </div>
                      <Link href="/setup-2fa">
                        <button className="h-8 px-3 rounded-md border border-[#2A2A2A] text-xs text-[#8A8682] hover:text-white hover:bg-[#1C1C1C] transition-colors">
                          Regenerate
                        </button>
                      </Link>
                    </div>
                  </>
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
