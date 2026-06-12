"use client";

import { useState } from "react";
import { CreditCard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { Card } from "@/lib/schema";

interface CardsClientProps {
  cards: Card[];
  userId: string;
}

export function CardsClient({ cards }: CardsClientProps) {
  const { toast } = useToast();
  const [requesting, setRequesting] = useState(false);

  const handleRequestCard = async () => {
    setRequesting(true);
    // Mock card creation for now
    setTimeout(() => {
      setRequesting(false);
      toast({
        title: "Card Requested",
        description: "Your virtual card will be available shortly.",
        variant: "success",
      });
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Cards</h1>
          <p className="text-sm text-text-secondary mt-1">Manage your debit cards</p>
        </div>
        <Button variant="accent" onClick={handleRequestCard} disabled={requesting}>
          <Plus className="h-4 w-4 mr-2" />
          Request Virtual Card
        </Button>
      </div>

      {cards.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((card) => (
            <div
              key={card.id}
              className="rounded-lg border border-border bg-bg-elevated text-text-primary p-6 min-h-[200px] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60 uppercase tracking-wider">
                  {card.cardType} Card
                </span>
                <CreditCard className="h-6 w-6 text-accent-gold" />
              </div>

              <div className="space-y-4">
                <p className="text-lg font-mono tracking-wider">{card.cardNumber}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-white/60">Expires</p>
                    <p className="text-sm font-medium">{card.expiryDate}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    card.isActive ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
                  }`}>
                    {card.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-lg border border-border bg-bg-elevated">
          <CreditCard className="h-12 w-12 text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No cards yet</h3>
          <p className="text-sm text-text-secondary mb-6">Request a virtual card to get started</p>
          <Button variant="accent" onClick={handleRequestCard} disabled={requesting}>
            <Plus className="h-4 w-4 mr-2" />
            Request Virtual Card
          </Button>
        </div>
      )}
    </div>
  );
}
