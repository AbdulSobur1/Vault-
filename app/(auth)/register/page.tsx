"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { countries } from "@/lib/countries";

function isAtLeast18(dob: string): boolean {
  const birth = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  const adjustedAge = m < 0 || (m === 0 && today.getDate() < birth.getDate()) ? age - 1 : age;
  return adjustedAge >= 18;
}

const maxDOB = new Date();
maxDOB.setFullYear(maxDOB.getFullYear() - 18);
const maxDOBString = maxDOB.toISOString().split('T')[0];

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [form, setForm] = useState({
    surname: "",
    firstname: "",
    middlename: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
    nationality: "Nigeria",
    phone: "",
    nin: "",
    address: "",
    terms: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedCountry = countries.find(c => c.name === form.nationality) || countries.find(c => c.code === 'NG')!;

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCountryChange = (countryName: string) => {
    updateField("nationality", countryName);
  };

  const [ageError, setAgeError] = useState("");

  const handleDobChange = (value: string) => {
    updateField("dob", value);
    if (value) {
      if (!isAtLeast18(value)) {
        setAgeError("You must be at least 18 years old to open an account.");
      } else {
        setAgeError("");
      }
    } else {
      setAgeError("");
    }
  };

  const validate = (): string | null => {
    if (!form.surname || !form.firstname || !form.email || !form.password || !form.nin) {
      return "Surname, first name, email, password, and NIN are required.";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }
    if (form.nin.length !== 11 || !/^\d+$/.test(form.nin)) {
      return "NIN must be exactly 11 digits.";
    }
    if (!form.terms) {
      return "You must agree to the terms and conditions.";
    }
    if (form.dob && !isAtLeast18(form.dob)) {
      return "You must be at least 18 years old to open an account.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // Prepend dial code to phone number before sending
      const phoneWithCode = form.phone ? `${selectedCountry.dialCode}${form.phone}` : "";

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, phone: phoneWithCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      toast({
        title: "Registration successful",
        description: "Your account has been created. Please sign in.",
        variant: "success",
      });

      router.push("/login");
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-bg-base">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-4">              <span className="text-2xl font-medium tracking-tight">
              Vault<span className="text-accent-gold">é</span>
            </span>
          </Link>
          <CardTitle>Open an Account</CardTitle>
          <CardDescription>Create your Vaulté account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="surname">Surname *</Label>
                <Input
                  id="surname"
                  value={form.surname}
                  onChange={(e) => updateField("surname", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstname">First Name *</Label>
                <Input
                  id="firstname"
                  value={form.firstname}
                  onChange={(e) => updateField("firstname", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="middlename">Middle Name</Label>
              <Input
                id="middlename"
                value={form.middlename}
                onChange={(e) => updateField("middlename", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  max={maxDOBString}
                  value={form.dob}
                  onChange={(e) => handleDobChange(e.target.value)}
                />
                {ageError && (
                  <p className="text-xs text-red-500">{ageError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={form.gender === "male"}
                      onChange={(e) => updateField("gender", e.target.value)}
                      className="text-accent-gold focus:ring-accent-gold"
                    />
                    Male
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={form.gender === "female"}
                      onChange={(e) => updateField("gender", e.target.value)}
                      className="text-accent-gold focus:ring-accent-gold"
                    />
                    Female
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <select
                id="nationality"
                value={form.nationality}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="flex h-9 w-full rounded-md border border-border bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-gold text-text-primary"
              >
                <option value="">Select nationality</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="flex items-stretch border border-border rounded-md focus-within:ring-1 focus-within:ring-accent-gold">
                  <span className="flex items-center px-3 border-r border-border bg-bg-surface rounded-l-md text-sm text-text-secondary select-none min-w-[64px]">
                    {selectedCountry.dialCode}
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="8012345678"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="flex-1 bg-transparent border-0 rounded-r-md px-3 py-2 text-sm focus:outline-none text-text-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nin">NIN/BVN *</Label>
                <Input
                  id="nin"
                  placeholder="11 digits"
                  maxLength={11}
                  value={form.nin}
                  onChange={(e) => updateField("nin", e.target.value.replace(/\D/g, ""))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Residential Address</Label>
              <textarea
                id="address"
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                className="flex min-h-[60px] w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-gold text-text-primary"
                rows={2}
              />
            </div>

            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.terms}
                onChange={(e) => updateField("terms", e.target.checked)}
                className="mt-1 text-accent-gold focus:ring-accent-gold"
              />
              <span className="text-text-secondary">
                I agree to the{" "}
                <Link href="#" className="text-accent-gold">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-accent-gold">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {error && (
              <div className="rounded-md border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-500">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" variant="accent" disabled={loading || !!ageError}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="text-accent-gold hover:text-accent-gold font-medium">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
