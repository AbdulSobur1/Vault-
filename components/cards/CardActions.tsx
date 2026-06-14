'use client';

import { useState } from 'react';
import { Eye, EyeOff, Snowflake, Sun, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface CardActionsProps {
  cardId: string;
  status: string;
  onStatusChange: (newStatus: string) => void;
  onReveal: (details: { fullNumber: string; cvv: string }) => void;
  onHide: () => void;
  isRevealed: boolean;
}

export function CardActions({ cardId, status, onStatusChange, onReveal, onHide, isRevealed }: CardActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAction = async (action: 'freeze' | 'unfreeze' | 'cancel') => {
    if (action === 'cancel') {
      const confirmed = window.confirm(
        'Are you sure you want to cancel this card? This cannot be undone.'
      );
      if (!confirmed) return;
    }

    setLoading(action);
    try {
      const res = await fetch(`/api/cards/${cardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok) {
        onStatusChange(data.status);
        toast({
          title: action === 'freeze' ? 'Card frozen' : action === 'unfreeze' ? 'Card unfrozen' : 'Card cancelled',
          description: action === 'cancel' ? 'Your card has been permanently cancelled.' : undefined,
        });
      } else {
        toast({ title: 'Action failed', description: data.error, variant: 'error' });
      }
    } catch {
      toast({ title: 'Action failed', description: 'Network error', variant: 'error' });
    } finally {
      setLoading(null);
    }
  };

  const handleReveal = async () => {
    if (isRevealed) { onHide(); return; }
    setLoading('reveal');
    try {
      const res = await fetch(`/api/cards/${cardId}/reveal`);
      const data = await res.json();
      if (res.ok) {
        onReveal({ fullNumber: data.number, cvv: data.cvv });
      } else {
        toast({ title: 'Could not reveal card', description: data.error, variant: 'error' });
      }
    } catch {
      toast({ title: 'Could not reveal card', description: 'Network error', variant: 'error' });
    } finally {
      setLoading(null);
    }
  };

  const isCancelled = status === 'cancelled';
  const isFrozen = status === 'inactive';

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {/* Reveal / Hide */}
      {!isCancelled && (
        <button
          onClick={handleReveal}
          disabled={!!loading}
          className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-[#2A2A2A] text-xs text-[#8A8682] hover:text-white hover:border-[#3A3A3A] transition-colors disabled:opacity-50"
        >
          {loading === 'reveal' ? <Loader2 size={12} className="animate-spin" /> : isRevealed ? <EyeOff size={12} /> : <Eye size={12} />}
          {isRevealed ? 'Hide details' : 'Show card details'}
        </button>
      )}

      {/* Freeze / Unfreeze */}
      {!isCancelled && (
        <button
          onClick={() => handleAction(isFrozen ? 'unfreeze' : 'freeze')}
          disabled={!!loading}
          className={`flex items-center gap-1.5 h-8 px-3 rounded-md border text-xs transition-colors disabled:opacity-50 ${
            isFrozen
              ? 'border-[#C9A84C]/40 text-[#C9A84C] hover:bg-[#C9A84C]/10'
              : 'border-[#2A2A2A] text-[#8A8682] hover:text-blue-400 hover:border-blue-400/40'
          }`}
        >
          {loading === 'freeze' || loading === 'unfreeze'
            ? <Loader2 size={12} className="animate-spin" />
            : isFrozen ? <Sun size={12} /> : <Snowflake size={12} />
          }
          {isFrozen ? 'Unfreeze' : 'Freeze card'}
        </button>
      )}

      {/* Cancel */}
      {!isCancelled && (
        <button
          onClick={() => handleAction('cancel')}
          disabled={!!loading}
          className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-[#E05252]/30 text-xs text-[#E05252] hover:bg-[#E05252]/10 hover:border-[#E05252] transition-colors disabled:opacity-50"
        >
          {loading === 'cancel' ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          Cancel card
        </button>
      )}

      {isCancelled && (
        <span className="text-xs text-[#555250] italic">This card has been cancelled</span>
      )}
    </div>
  );
}
