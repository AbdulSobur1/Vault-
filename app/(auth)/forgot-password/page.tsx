"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // Showcoming soon toast - feature not implemented yet
    toast({
      title: "Coming Soon",
      description: "Password reset will be available in a future update.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg-base">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-4">
            <span className="text-2xl font-medium tracking-tight">
              Vault<span className="text-accent-gold">é</span>
            </span>
          </Link>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" variant="accent">
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-text-secondary mb-4">
                If an account exists with that email, we&apos;ve sent a password reset link.
              </p>
              <Button
                variant="ghost"
                onClick={() => setSubmitted(false)}
              >
                Try again
              </Button>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-text-secondary">
            Remember your password?{" "}
            <Link href="/login" className="text-accent-gold hover:text-accent-gold font-medium">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
