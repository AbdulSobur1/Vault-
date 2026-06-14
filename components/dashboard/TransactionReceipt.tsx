'use client';

import { useRef, useState } from 'react';
import { X, Download, Copy, Check, ArrowDownLeft, ArrowUpRight, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface PartyInfo {
  name: string;
  accountNumber: string;
  accountType: string;
  bank: string;
}

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: string;
  description: string | null;
  reference: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: Date | string;
  accountId: string;
  accountNumber?: string;
  accountType?: string;
  counterpartyName?: string | null;
  counterpartyAccount?: string | null;
  sender?: PartyInfo | null;
  recipient?: PartyInfo | null;
}

interface TransactionReceiptProps {
  transaction: Transaction | null;
  userName: string;
  onClose: () => void;
}

function formatNGN(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatFullDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-NG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Africa/Lagos',
  }).format(new Date(date));
}

export function TransactionReceipt({ transaction, userName, onClose }: TransactionReceiptProps) {
  const [copied, setCopied] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!transaction) return null;

  const isCredit = transaction.type === 'credit';
  const amount = Number(transaction.amount);

  const handleCopyReference = async () => {
    await navigator.clipboard.writeText(transaction.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = receiptRef.current;
    if (!element) return;

    html2pdf(element, {
      margin: 0,
      filename: `vaulte-receipt-${transaction.reference}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, backgroundColor: '#161616' },
      jsPDF: { unit: 'mm', format: 'a5', orientation: 'portrait' },
    });
  };

  const statusConfig = {
    completed: { icon: CheckCircle2, color: 'text-[#4CAF82]', bg: 'bg-[#2D6A4F]/20', label: 'Completed' },
    pending:   { icon: Clock,        color: 'text-[#C9A84C]', bg: 'bg-[#C9A84C]/10', label: 'Pending'   },
    failed:    { icon: XCircle,      color: 'text-[#E05252]', bg: 'bg-[#E05252]/10', label: 'Failed'    },
  };
  const status = statusConfig[transaction.status];
  const StatusIcon = status.icon;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet — slides from right on desktop, from bottom on mobile */}
      <div className="
        fixed z-50 bg-[#111111] border-[#2A2A2A] flex flex-col shadow-2xl

        /* Desktop: right side panel */
        lg:right-0 lg:top-0 lg:bottom-0 lg:w-full lg:max-w-md lg:border-l

        /* Mobile: bottom sheet with safe area support */
        max-lg:left-0 max-lg:right-0 max-lg:bottom-0
        max-lg:rounded-t-2xl max-lg:border-t
        max-lg:max-h-[92dvh]
      ">

        {/* Sheet header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2A2A2A] shrink-0">
          <div>
            <h2 className="text-white font-semibold text-base">Transaction Receipt</h2>
            <p className="text-xs text-[#555250] mt-0.5 font-mono">{transaction.reference}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#8A8682] hover:text-white hover:bg-[#1C1C1C] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable receipt body */}
        <div className="flex-1 overflow-y-auto p-6 pb-safe">
          <div ref={receiptRef} className="bg-[#161616] rounded-xl border border-[#2A2A2A] overflow-hidden">

            {/* Receipt header — amount hero */}
            <div className="bg-[#0F0F0F] px-6 py-8 text-center border-b border-[#2A2A2A]">
              {/* Direction icon */}
              <div className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center ${
                isCredit ? 'bg-[#2D6A4F]/20' : 'bg-[#E05252]/10'
              }`}>
                {isCredit
                  ? <ArrowDownLeft size={24} className="text-[#4CAF82]" />
                  : <ArrowUpRight size={24} className="text-[#E05252]" />
                }
              </div>

              {/* Amount */}
              <p className={`text-4xl font-semibold tracking-tight mb-1 ${
                isCredit ? 'text-[#4CAF82]' : 'text-[#E05252]'
              }`}>
                {isCredit ? '+' : '−'}{formatNGN(amount)}
              </p>

              {/* Transaction type label */}
              <p className="text-sm text-[#8A8682] mb-4">
                {isCredit ? 'Money Received' : 'Money Sent'}
              </p>

              {/* Status badge */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                <StatusIcon size={12} />
                {status.label}
              </div>
            </div>

            {/* Receipt details */}
            <div className="px-6 py-6 space-y-0 divide-y divide-[#2A2A2A]">

              {/* 1. Date & Time */}
              <div className="flex justify-between items-start py-4">
                <span className="text-xs text-[#555250] uppercase tracking-wider">Date & Time</span>
                <span className="text-sm text-white text-right max-w-[55%] leading-relaxed">
                  {formatFullDate(transaction.createdAt)}
                </span>
              </div>

              {/* 2. Description */}
              <div className="flex justify-between items-start py-4">
                <span className="text-xs text-[#555250] uppercase tracking-wider">Description</span>
                <span className="text-sm text-white text-right max-w-[55%]">
                  {transaction.description || 'Transfer'}
                </span>
              </div>

              {/* 3. Sender */}
              {transaction.sender && (
                <div className="flex justify-between items-start py-4">
                  <span className="text-xs text-[#555250] uppercase tracking-wider shrink-0 mr-4">Sender</span>
                  <div className="text-right">
                    <p className="text-sm text-white font-medium">{transaction.sender.name}</p>
                    <p className="text-xs text-[#555250] font-mono mt-0.5">{transaction.sender.accountNumber}</p>
                    <p className="text-xs text-[#555250] mt-0.5 capitalize">
                      {transaction.sender.bank} · {transaction.sender.accountType} Account
                    </p>
                  </div>
                </div>
              )}

              {/* 4. Recipient */}
              {transaction.recipient && (
                <div className="flex justify-between items-start py-4">
                  <span className="text-xs text-[#555250] uppercase tracking-wider shrink-0 mr-4">Recipient</span>
                  <div className="text-right">
                    <p className="text-sm text-white font-medium">{transaction.recipient.name}</p>
                    <p className="text-xs text-[#555250] font-mono mt-0.5">{transaction.recipient.accountNumber}</p>
                    <p className="text-xs text-[#555250] mt-0.5 capitalize">
                      {transaction.recipient.bank} · {transaction.recipient.accountType} Account
                    </p>
                  </div>
                </div>
              )}

              {/* Fallback account when no sender/recipient (funding, fees, etc.) */}
              {!transaction.sender && !transaction.recipient && (
                <div className="flex justify-between items-start py-4">
                  <span className="text-xs text-[#555250] uppercase tracking-wider">Account</span>
                  <div className="text-right">
                    <p className="text-sm text-white">{transaction.accountNumber}</p>
                    <p className="text-xs text-[#555250] capitalize mt-0.5">
                      Vaulté · {transaction.accountType} Account
                    </p>
                  </div>
                </div>
              )}

              {/* 5. Type */}
              <div className="flex justify-between items-center py-4">
                <span className="text-xs text-[#555250] uppercase tracking-wider">Type</span>
                <span className="text-sm text-white capitalize">{transaction.type}</span>
              </div>

              {/* 6. Reference */}
              <div className="flex justify-between items-center py-4">
                <span className="text-xs text-[#555250] uppercase tracking-wider">Reference</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white font-mono">{transaction.reference}</span>
                  <button
                    onClick={handleCopyReference}
                    className="text-[#555250] hover:text-[#C9A84C] transition-colors"
                    aria-label="Copy reference"
                  >
                    {copied
                      ? <Check size={13} className="text-[#4CAF82]" />
                      : <Copy size={13} />
                    }
                  </button>
                </div>
              </div>

              {/* 7. Transaction ID */}
              <div className="flex justify-between items-center py-4">
                <span className="text-xs text-[#555250] uppercase tracking-wider">Transaction ID</span>
                <span className="text-xs text-[#555250] font-mono">{transaction.id.slice(0, 16)}...</span>
              </div>
            </div>

            {/* Receipt footer — Vaulté branding */}
            <div className="px-6 py-5 border-t border-[#2A2A2A] bg-[#0F0F0F] text-center">
              <p className="text-xs text-[#555250]">
                Issued to <span className="text-white">{userName}</span> by <span className="text-[#C9A84C] font-medium">Vaulté</span> &middot; vaulte.app
              </p>
              <p className="text-[10px] text-[#3A3A3A] mt-1">
                This receipt is for reference only and does not constitute a bank statement.
              </p>
            </div>
          </div>
        </div>

        {/* Fixed bottom action bar */}
        <div className="px-6 py-4 border-t border-[#2A2A2A] flex gap-3 shrink-0 bg-[#111111]">
          <button
            onClick={handleCopyReference}
            className="flex-1 h-10 rounded-md border border-[#2A2A2A] text-[#8A8682] text-sm hover:bg-[#1C1C1C] hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            {copied ? <Check size={15} className="text-[#4CAF82]" /> : <Copy size={15} />}
            {copied ? 'Copied!' : 'Copy Reference'}
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex-1 h-10 rounded-md bg-[#C9A84C] text-[#0A0A0A] text-sm font-medium hover:bg-[#b8973d] transition-colors flex items-center justify-center gap-2"
          >
            <Download size={15} />
            Download PDF
          </button>
        </div>
      </div>
    </>
  );
}
