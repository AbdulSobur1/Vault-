"use client";

import { Landmark, Briefcase, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

const loanTypes = [
  {
    icon: Briefcase,
    title: "Personal Loan",
    description: "Get quick access to funds for personal needs. Flexible repayment terms from 3 to 24 months.",
    rate: "From 12% APR",
    amount: "Up to ₦5,000,000",
  },
  {
    icon: Landmark,
    title: "Business Loan",
    description: "Grow your business with tailored financing solutions. Competitive rates for SMEs and corporates.",
    rate: "From 15% APR",
    amount: "Up to ₦50,000,000",
  },
  {
    icon: Home,
    title: "Mortgage",
    description: "Make your dream home a reality with our flexible mortgage plans for residential properties.",
    rate: "From 9% APR",
    amount: "Up to ₦100,000,000",
  },
];

export default function LoansPage() {
  const { toast } = useToast();

  const handleApply = () => {
    toast({
      title: "Coming Soon",
      description: "Loan applications will be available in a future update.",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-medium">Loans</h1>
        <p className="text-sm text-text-secondary mt-1">Explore our loan offerings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {loanTypes.map((loan) => {
          const Icon = loan.icon;
          return (
            <div
              key={loan.title}
              className="rounded-lg border border-border bg-bg-elevated p-6 flex flex-col"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-bg-base mb-4">
                <Icon className="h-6 w-6 text-accent-gold" />
              </div>
              <h3 className="text-lg font-medium mb-2">{loan.title}</h3>
              <p className="text-sm text-text-secondary mb-4 flex-1">{loan.description}</p>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Interest Rate</span>
                  <span className="font-medium">{loan.rate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Maximum</span>
                  <span className="font-medium">{loan.amount}</span>
                </div>
              </div>
              <Button variant="accent" onClick={handleApply}>
                Apply Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>

      {/* Eligibility section */}
      <div className="rounded-lg border border-border bg-bg-elevated p-6">
        <h3 className="text-base font-medium mb-4">Eligibility Criteria</h3>
        <ul className="space-y-3 text-sm text-text-secondary">
          <li className="flex items-start gap-2">
            <span className="text-accent-gold mt-0.5">•</span>
            Must have an active Vaulté account for at least 6 months
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-gold mt-0.5">•</span>
            Regular income deposits into your Vaulté account
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-gold mt-0.5">•</span>
            Good transaction history with no defaults
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-gold mt-0.5">•</span>
            Valid government-issued ID and proof of address
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-gold mt-0.5">•</span>
            Minimum monthly income of ₦100,000 for personal loans
          </li>
        </ul>
      </div>
    </div>
  );
}
