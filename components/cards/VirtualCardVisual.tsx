interface VirtualCardVisualProps {
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  currency: string;
  cardholderName: string;
  status: string;
  // Revealed details — only present after user clicks "Show card details"
  fullNumber?: string;
  cvv?: string;
}

export function VirtualCardVisual({
  last4, expiryMonth, expiryYear, currency,
  cardholderName, status, fullNumber, cvv
}: VirtualCardVisualProps) {
  const isActive = status === 'active';
  const isFrozen = status === 'inactive';

  const displayNumber = fullNumber
    ? fullNumber.replace(/(\d{4})/g, '$1 ').trim()
    : `\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 ${last4}`;

  return (
    <div className={`relative w-full max-w-[380px] h-52 rounded-2xl p-6 overflow-hidden transition-all
      ${isFrozen ? 'opacity-60 grayscale' : ''}
    `}
      style={{
        background: currency === 'USD'
          ? 'linear-gradient(135deg, #0A0A0A 0%, #1C1C1C 50%, #0f1a0f 100%)'
          : 'linear-gradient(135deg, #0A0A0A 0%, #1a1400 50%, #2a1f00 100%)',
      }}
    >
      {/* Subtle background circles */}
      <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full border border-white/5" />
      <div className="absolute -right-4 -top-4 w-28 h-28 rounded-full border border-white/5" />

      {/* Top row: chip + currency badge */}
      <div className="relative z-10 flex items-center justify-between mb-5">
        {/* EMV chip */}
        <div className="w-10 h-7 rounded-md bg-[#C9A84C] grid grid-cols-2 gap-0.5 p-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#a88a3c] rounded-sm" />
          ))}
        </div>

        <div className="flex items-center gap-2">
          {isFrozen && (
            <span className="text-[10px] font-medium text-blue-400 border border-blue-400/30 rounded-full px-2 py-0.5">
              FROZEN
            </span>
          )}
          <span className="text-[10px] font-semibold text-white/50 tracking-widest">
            {currency}
          </span>
        </div>
      </div>

      {/* Card number */}
      <p className="relative z-10 text-base font-mono tracking-[0.18em] text-white mb-5 select-all">
        {displayNumber}
      </p>

      {/* Bottom row: name + expiry + CVV + Visa */}
      <div className="relative z-10 flex items-end justify-between">
        <div>
          <p className="text-[9px] text-white/40 uppercase tracking-widest mb-0.5">Card Holder</p>
          <p className="text-sm font-medium text-white">{cardholderName}</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] text-white/40 uppercase tracking-widest mb-0.5">Expires</p>
          <p className="text-sm font-medium text-white">{expiryMonth}/{expiryYear}</p>
        </div>
        {cvv && (
          <div className="text-center">
            <p className="text-[9px] text-white/40 uppercase tracking-widest mb-0.5">CVV</p>
            <p className="text-sm font-medium text-white">{cvv}</p>
          </div>
        )}
        <p className="text-base font-bold text-white/40 italic">VISA</p>
      </div>
    </div>
  );
}
