"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { Moon, Sun, User, Shield, Settings as SettingsIcon } from "lucide-react";
import { useThemeMode } from "@/lib/use-theme";
import type { User as UserType } from "@/lib/schema";

interface SettingsClientProps {
  user: UserType;
}

export function SettingsClient({ user }: SettingsClientProps) {
  const { toast } = useToast();
  const { theme, setTheme, mounted } = useThemeMode();

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
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Theme</p>
                  <p className="text-xs text-text-secondary">Toggle between light and dark mode</p>
                </div>                    {mounted && (
                      <Button variant="outline" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                        {theme === "dark" ? (
                          <><Sun className="h-4 w-4 mr-2" /> Light Mode</>
                        ) : (
                          <><Moon className="h-4 w-4 mr-2" /> Dark Mode</>
                        )}
                      </Button>
                    )}
              </div>

              <div className="border-t border-border" />

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
