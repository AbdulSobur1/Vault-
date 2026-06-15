'use client';

import { useState, useEffect } from 'react';
import { VirtualCardVisual } from '@/components/cards/VirtualCardVisual';
import { CardActions } from '@/components/cards/CardActions';
import { Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { useSession } from 'next-auth/react';

export default function CardsPage() {
  const { data: session } = useSession();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [newCardCurrency, setNewCardCurrency] = useState<'USD' | 'NGN'>('USD');
  const [revealedCard, setRevealedCard] = useState<Record<string, { fullNumber: string; cvv: string }>>({});
  const { toast } = useToast();

  const fetchCards = async () => {
    try {
      const res = await fetch('/api/cards');
      const data = await res.json();
      setCards(data.cards ?? []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCards(); }, []);

  const handleRequestCard = async () => {
    setRequesting(true);
    try {
      const res = await fetch('/api/cards/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency: newCardCurrency }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: `${newCardCurrency} virtual card issued!`, description: 'Your card is ready to use.' });
        setShowRequest(false);
        fetchCards();
      } else {
        toast({ title: 'Card request failed', description: data.error, variant: 'error' });
      }
    } catch {
      toast({ title: 'Card request failed', description: 'Network error', variant: 'error' });
    } finally {
      setRequesting(false);
    }
  };

  const handleStatusChange = (cardId: string, newStatus: string) => {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, status: newStatus, isActive: newStatus === 'active' } : c));
  };

  const handleReveal = (cardId: string, details: { fullNumber: string; cvv: string }) => {
    setRevealedCard(prev => ({ ...prev, [cardId]: details }));
  };

  const handleHide = (cardId: string) => {
    setRevealedCard(prev => { const n = { ...prev }; delete n[cardId]; return n; });
  };

  const userName = `${session?.user?.name ?? 'Card Holder'}`;
  const activeCards = cards.filter(c => c.status !== 'cancelled');
  const hasUSD = activeCards.some(c => c.currency === 'USD');
  const hasNGN = activeCards.some(c => c.currency === 'NGN');

  return (
    <div className="w-full max-w-2xl space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Cards</h1>
          <p className="text-sm text-[#8A8682] mt-1">Manage your virtual cards</p>
        </div>
        {(!hasUSD || !hasNGN) && (
          <button
            onClick={() => setShowRequest(true)}
            className="flex items-center gap-1.5 h-9 px-4 rounded-md bg-[#C9A84C] text-[#0A0A0A] text-sm font-medium hover:bg-[#b8973d] transition-colors"
          >
            <Plus size={15} />
            New Card
          </button>
        )}
      </div>

      {/* Request new card modal — full screen on mobile, centered on desktop */}
      {showRequest && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setShowRequest(false)} />
          <div className="fixed inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 z-50 bg-[#161616] border border-[#2A2A2A] rounded-xl p-6 w-auto sm:w-full sm:max-w-sm space-y-5">
            <h2 className="text-white font-semibold">Request Virtual Card</h2>
            <p className="text-sm text-[#8A8682]">
              Choose the currency for your new virtual card. You can hold one active card per currency.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {(['USD', 'NGN'] as const).map(cur => {
                const alreadyHas = activeCards.some(c => c.currency === cur);
                return (
                  <button
                    key={cur}
                    onClick={() => !alreadyHas && setNewCardCurrency(cur)}
                    disabled={alreadyHas}
                    className={`py-4 rounded-lg border text-sm font-medium transition-all ${
                      alreadyHas
                        ? 'border-[#2A2A2A] text-[#555250] cursor-not-allowed opacity-50'
                        : newCardCurrency === cur
                          ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-white'
                          : 'border-[#2A2A2A] text-[#8A8682] hover:border-[#3A3A3A]'
                    }`}
                  >
                    <div className="text-lg mb-1">{cur === 'USD' ? '\uD83C\uDDFA\uD83C\uDDF8' : '\uD83C\uDDF3\uD83C\uDDEC'}</div>
                    <div>{cur}</div>
                    {alreadyHas && <div className="text-[10px] mt-1 text-[#555250]">Already active</div>}
                  </button>
                );
              })}
            </div>

            <div className="bg-[#0F0F0F] rounded-lg p-4 text-xs text-[#555250] space-y-1">
              <p>✓ Instant issuance — card ready in seconds</p>
              <p>✓ Works for online payments globally</p>
              <p>✓ Freeze or cancel anytime</p>
              <p>✓ Powered by Sudo Africa (Visa)</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRequest(false)}
                className="flex-1 h-10 rounded-md border border-[#2A2A2A] text-[#8A8682] text-sm hover:bg-[#1C1C1C] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestCard}
                disabled={requesting}
                className="flex-1 h-10 rounded-md bg-[#C9A84C] text-[#0A0A0A] text-sm font-medium hover:bg-[#b8973d] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                {requesting && <Loader2 size={14} className="animate-spin" />}
                {requesting ? 'Issuing...' : `Issue ${newCardCurrency} Card`}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[...Array(1)].map((_, i) => (
            <div key={i} className="h-52 rounded-2xl bg-[#161616] border border-[#2A2A2A] animate-pulse max-w-[380px]" />
          ))}
        </div>
      )}

      {/* No cards */}
      {!loading && cards.length === 0 && (
        <div className="rounded-xl border border-[#2A2A2A] bg-[#161616] p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center mx-auto">
            <span className="text-[#C9A84C] text-xl">💳</span>
          </div>
          <div>
            <p className="text-white font-medium">No cards yet</p>
            <p className="text-sm text-[#555250] mt-1">
              Request a virtual USD or NGN card to start spending online globally.
            </p>
          </div>
          <button
            onClick={() => setShowRequest(true)}
            className="h-9 px-6 rounded-md bg-[#C9A84C] text-[#0A0A0A] text-sm font-medium hover:bg-[#b8973d] transition-colors"
          >
            Request your first card
          </button>
        </div>
      )}

      {/* Card list */}
      {!loading && cards.map(card => (
        <div key={card.id} className="space-y-4">
          <VirtualCardVisual
            last4={card.last4}
            expiryMonth={card.expiryMonth}
            expiryYear={card.expiryYear}
            currency={card.currency}
            cardholderName={userName}
            status={card.status}
            fullNumber={revealedCard[card.id]?.fullNumber}
            cvv={revealedCard[card.id]?.cvv}
          />
          <CardActions
            cardId={card.id}
            status={card.status}
            onStatusChange={(s) => handleStatusChange(card.id, s)}
            onReveal={(d) => handleReveal(card.id, d)}
            onHide={() => handleHide(card.id)}
            isRevealed={!!revealedCard[card.id]}
          />
          {/* Card meta */}
          <div className="flex items-center gap-4 text-xs text-[#555250]">
            <span className={`flex items-center gap-1 ${card.status === 'active' ? 'text-[#4CAF82]' : card.status === 'inactive' ? 'text-blue-400' : 'text-[#E05252]'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {card.status === 'active' ? 'Active' : card.status === 'inactive' ? 'Frozen' : 'Cancelled'}
            </span>
            <span>·</span>
            <span>{card.currency} Virtual Card</span>
            <span>·</span>
            <span>Powered by Sudo Africa</span>
          </div>
        </div>
      ))}
    </div>
  );
}
