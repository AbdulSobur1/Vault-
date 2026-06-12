"use client";

import { useState } from "react";
import { CreditCard, Plus, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import type { Card as CardType } from "@/lib/schema";

interface CardsClientProps {
  cards: CardType[];
  userId: string;
  accounts: {
    id: string;
    accountType: string;
    accountNumber: string;
    balance: string;
  }[];
}

async function fetchUser(userId: string) {
  // We don't have the user info in this context, but we can get it from the session
  // For card display, we'll show a generic name
  return { firstname: "", surname: "" };
}

export function CardsClient({ cards, accounts }: CardsClientProps) {
  const { toast } = useToast();
  const [requesting, setRequesting] = useState(false);
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [newCard, setNewCard] = useState<{
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardType: string;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [viewCardId, setViewCardId] = useState<string | null>(null);
  const [freezing, setFreezing] = useState<string | null>(null);

  // Accounts are passed from the server

  const handleRequestCard = async () => {
    if (cards.length > 0) {
      setViewCardId(viewCardId ? null : cards[0].id);
      return;
    }

    // If only one account, use it directly; otherwise show dialog
    if (accounts.length === 1) {
      await submitCardRequest(accounts[0].id);
    } else if (accounts.length > 1) {
      toast({
        title: "Select an account",
        description: "Please select which account to link this card to.",
        variant: "default",
      });
      // Could show a dialog here for account selection
      // For now, use the first account
      await submitCardRequest(accounts[0].id);
    } else {
      toast({
        title: "No accounts",
        description: "You need an account before requesting a card.",
        variant: "error",
      });
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {}
  };

  const handleFreezeToggle = async (cardId: string, currentActive: boolean, action: "freeze" | "unfreeze" | "cancel") => {
    setFreezing(cardId);
    try {
      const res = await fetch(`/api/cards/${cardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast({
          title: "Error",
          description: data.error || "Failed to update card",
          variant: "error",
        });
        setFreezing(null);
        return;
      }

      toast({
        title: "Card updated",
        description: action === "cancel"
          ? "Card has been cancelled."
          : `Card has been ${action === "unfreeze" ? "unfrozen" : "frozen"}.`,
      });

      // Reload the page to reflect changes
      window.location.reload();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update card",
        variant: "error",
      });
    }
    setFreezing(null);
  };

  // Show creation modal with card details
  const openCreationModal = async () => {
    if (accounts.length === 0) {
      toast({
        title: "No accounts",
        description: "You need an account before requesting a card.",
        variant: "error",
      });
      return;
    }
    await submitCardRequest(accounts[0].id);
  };

  const submitCardRequest = async (accountId: string) => {
    if (!accountId) {
      toast({ title: "Error", description: "Please select an account", variant: "error" });
      return;
    }

    setRequesting(true);
    try {
      const res = await fetch("/api/cards/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Error",
          description: data.error || "Failed to create card",
          variant: "error",
        });
        setRequesting(false);
        return;
      }

      setNewCard(data.card);
      setShowCreationModal(true);
      toast({
        title: "Card Created",
        description: data.message,
        variant: "success",
      });

      // Reload after modal closes
    } catch {
      toast({
        title: "Error",
        description: "Failed to create card",
        variant: "error",
      });
    }
    setRequesting(false);
  };

  const handleCloseCreationModal = () => {
    setShowCreationModal(false);
    setNewCard(null);
    window.location.reload();
  };

  const activeCards = cards.filter((c) => c.isActive);
  const inactiveCards = cards.filter((c) => !c.isActive);
  const hasCards = cards.length > 0;
  const displayCard = viewCardId ? cards.find((c) => c.id === viewCardId) : activeCards[0] || cards[0];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Cards</h1>
          <p className="text-sm text-text-secondary mt-1">Manage your debit cards</p>
        </div>
        {!hasCards && (
          <Button
            variant="accent"
            onClick={openCreationModal}
            disabled={requesting}
          >
            <Plus className="h-4 w-4 mr-2" />
            Request Virtual Card
          </Button>
        )}
      </div>

      {/* Account selector for card creation */}
      {!hasCards && (
        <div className="max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Link a Card to Your Account</CardTitle>
              <CardDescription>
                To request a virtual card, please select an account from the accounts page first, then come back here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary mb-4">
                Visit your{" "}
                <a href="/accounts" className="text-accent-gold hover:underline">
                  Accounts page
                </a>{" "}
                to view your account details, then use the button above to request a card.
              </p>
              <Button variant="outline" asChild className="w-full">
                <a href="/accounts">Go to Accounts</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Card Display */}
      {hasCards && displayCard && (
        <div className="space-y-6">
          {/* Visual Card */}
          <div className="relative w-full max-w-[380px] h-52 rounded-2xl p-6 bg-gradient-to-br from-[#0A0A0A] to-[#1C1C1C] border border-[#2A2A2A] shadow-xl overflow-hidden">
            {/* Background texture lines — decorative */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-8 right-0 w-48 h-48 rounded-full border border-white translate-x-16" />
              <div className="absolute top-16 right-0 w-64 h-64 rounded-full border border-white translate-x-24" />
            </div>

            {/* Chip */}
            <div className="relative z-10 w-10 h-7 rounded-md bg-[#C9A84C] mb-5 grid grid-cols-2 gap-0.5 p-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#a88a3c] rounded-sm" />
              ))}
            </div>

            {/* Card number */}
            <p className="relative z-10 text-base font-mono tracking-[0.2em] text-white mb-5">
              {displayCard.cardNumber}
            </p>

            {/* Bottom row */}
            <div className="relative z-10 flex justify-between items-end">
              <div>
                <p className="text-[9px] text-white/40 uppercase tracking-widest mb-0.5">Card Holder</p>
                <p className="text-sm font-medium text-white">Vaulté User</p>
              </div>
              <div>
                <p className="text-[9px] text-white/40 uppercase tracking-widest mb-0.5">Expires</p>
                <p className="text-sm font-medium text-white">{displayCard.expiryDate}</p>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-white/60 italic">VISA</p>
              </div>
            </div>

            {/* Status badge */}
            <div className="absolute top-4 right-4 z-10">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                displayCard.isActive ? "bg-[#4CAF82]/20 text-[#4CAF82]" : "bg-[#E05252]/20 text-[#E05252]"
              }`}>
                {displayCard.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Card Actions */}
          <div className="flex flex-wrap gap-3">
            {displayCard.isActive ? (
              <Button
                variant="outline"
                size="sm"
                disabled={freezing === displayCard.id}
                onClick={() => handleFreezeToggle(displayCard.id, true, "freeze")}
              >
                {freezing === displayCard.id ? "Processing..." : "Freeze Card"}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled={freezing === displayCard.id}
                onClick={() => handleFreezeToggle(displayCard.id, false, "unfreeze")}
              >
                {freezing === displayCard.id ? "Processing..." : "Unfreeze Card"}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
              disabled={freezing === displayCard.id}
              onClick={() => handleFreezeToggle(displayCard.id, displayCard.isActive, "cancel")}
            >
              {freezing === displayCard.id ? "Processing..." : "Cancel Card"}
            </Button>
          </div>

          {/* Card list */}
          {cards.length > 1 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">All Cards</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {cards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => setViewCardId(card.id)}
                    className={`text-left rounded-lg border p-4 transition-colors ${
                      viewCardId === card.id
                        ? "border-accent-gold bg-accent-gold/5"
                        : "border-border bg-bg-elevated hover:border-accent-gold/50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs uppercase tracking-wider text-text-secondary">
                        {card.cardType}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        card.isActive ? "text-success" : "text-text-secondary"
                      }`}>
                        {card.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm font-mono tracking-wider">{card.cardNumber}</p>
                    <p className="text-xs text-text-secondary mt-1">Expires {card.expiryDate}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!hasCards && (
        <div className="text-center py-16 rounded-lg border border-border bg-bg-elevated">
          <CreditCard className="h-12 w-12 text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No cards yet</h3>
          <p className="text-sm text-text-secondary mb-6">
            Request a virtual card linked to your account
          </p>
        </div>
      )}

      {/* Card Created Modal - One-time details */}
      <Dialog open={showCreationModal} onOpenChange={handleCloseCreationModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Virtual Card is Ready</DialogTitle>
            <DialogDescription>
              Save these details now. Your CVV will not be shown again.
            </DialogDescription>
          </DialogHeader>
          {newCard && (
            <div className="space-y-4 mt-4">
              <div className="rounded-lg bg-bg-surface p-4 space-y-3 border border-border">
                <div>
                  <Label className="text-xs text-text-secondary">Card Number</Label>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm font-mono tracking-wider">{newCard.cardNumber}</p>
                    <button
                      onClick={() => copyToClipboard(newCard.cardNumber, "number")}
                      className="text-accent-gold hover:text-accent-gold/80"
                    >
                      {copiedField === "number" ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-text-secondary">Expiry Date</Label>
                    <p className="text-sm font-medium mt-1">{newCard.expiryDate}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-text-secondary">CVV</Label>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm font-mono font-bold">{newCard.cvv}</p>
                      <button
                        onClick={() => copyToClipboard(newCard.cvv, "cvv")}
                        className="text-accent-gold hover:text-accent-gold/80"
                      >
                        {copiedField === "cvv" ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-red-500/80 font-medium">
                ⚠ This is the only time your CVV is shown. Store it securely.
              </p>
              <Button variant="accent" className="w-full" onClick={handleCloseCreationModal}>
                Done — I&apos;ve saved my details
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
