"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

const nationalities = [
  "Afghan", "Albanian", "Algerian", "American", "Angolan", "Argentine", "Australian", "Austrian",
  "Bangladeshi", "Belgian", "Beninese", "Brazilian", "British", "Bulgarian", "Burkinabe",
  "Cambodian", "Cameroonian", "Canadian", "Chadian", "Chilean", "Chinese", "Colombian",
  "Congolese", "Costa Rican", "Croatian", "Cuban", "Czech",
  "Danish", "Dominican", "Dutch",
  "Ecuadorian", "Egyptian", "Emirati", "English", "Eritrean", "Estonian", "Ethiopian",
  "Filipino", "Finnish", "French",
  "Gabonese", "Gambian", "Georgian", "German", "Ghanaian", "Greek", "Guatemalan", "Guinean",
  "Haitian", "Honduran", "Hungarian",
  "Icelandic", "Indian", "Indonesian", "Iranian", "Iraqi", "Irish", "Israeli", "Italian", "Ivorian",
  "Jamaican", "Japanese", "Jordanian",
  "Kazakh", "Kenyan", "Korean", "Kuwaiti",
  "Laotian", "Latvian", "Lebanese", "Liberian", "Libyan", "Lithuanian", "Luxembourgish",
  "Malagasy", "Malawian", "Malaysian", "Malian", "Maltese", "Mauritanian", "Mexican", "Mongolian",
  "Moroccan", "Mozambican", "Myanmar",
  "Namibian", "Nepalese", "New Zealander", "Nicaraguan", "Nigerien", "Nigerian", "Norwegian",
  "Omani",
  "Pakistani", "Palestinian", "Panamanian", "Papua New Guinean", "Paraguayan", "Peruvian", "Polish",
  "Portuguese",
  "Qatari",
  "Romanian", "Russian", "Rwandan",
  "Saudi", "Scottish", "Senegalese", "Serbian", "Sierra Leonean", "Singaporean", "Slovak",
  "Slovenian", "Somali", "South African", "Spanish", "Sri Lankan", "Sudanese", "Swedish",
  "Swiss", "Syrian",
  "Taiwanese", "Tajik", "Tanzanian", "Thai", "Togolese", "Tunisian", "Turkish", "Turkmen",
  "Ugandan", "Ukrainian", "Uruguayan", "Uzbek",
  "Venezuelan", "Vietnamese", "Welsh",
  "Yemeni", "Zambian", "Zimbabwean",
];

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
    nationality: "",
    phone: "",
    nin: "",
    address: "",
    terms: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-surface dark:bg-dark-surface">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-4">
            <span className="text-2xl font-medium tracking-tight">
              Vault<span className="text-accent">é</span>
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
                  value={form.dob}
                  onChange={(e) => updateField("dob", e.target.value)}
                />
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
                      className="text-accent focus:ring-accent"
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
                      className="text-accent focus:ring-accent"
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
                onChange={(e) => updateField("nationality", e.target.value)}
                className="flex h-9 w-full rounded-md border border-border bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-accent dark:border-dark-border dark:text-white"
              >
                <option value="">Select nationality</option>
                {nationalities.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+234..."
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
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
                className="flex min-h-[60px] w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-accent dark:border-dark-border dark:text-white"
                rows={2}
              />
            </div>

            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.terms}
                onChange={(e) => updateField("terms", e.target.checked)}
                className="mt-1 text-accent focus:ring-accent"
              />
              <span className="text-muted">
                I agree to the{" "}
                <Link href="#" className="text-accent hover:text-accent-light">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-accent hover:text-accent-light">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {error && (
              <div className="rounded-md border border-danger/20 bg-danger/5 px-3 py-2 text-sm text-danger">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" variant="accent" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:text-accent-light font-medium">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
