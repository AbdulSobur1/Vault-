"use client";

import { useState, useRef, useEffect } from "react";

interface AmountInputProps {
  value: string;
  onChange: (raw: string) => void; // returns raw numeric string e.g. "20000000000"
  currency?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function AmountInput({
  value,
  onChange,
  currency = "NGN",
  placeholder = "0.00",
  className = "",
  disabled = false,
}: AmountInputProps) {
  const [displayValue, setDisplayValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const formatWithCommas = (raw: string): string => {
    // Remove all non-numeric except decimal point
    const cleaned = raw.replace(/[^0-9.]/g, "");

    // Split on decimal
    const parts = cleaned.split(".");
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (parts.length === 2) {
      // Limit to 2 decimal places
      return `${intPart}.${parts[1].slice(0, 2)}`;
    }
    return intPart;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, ""); // strip commas for raw value

    // Validate: only numbers and one decimal point
    if (!/^\d*\.?\d*$/.test(raw)) return;

    const formatted = formatWithCommas(raw);
    setDisplayValue(formatted);
    onChange(raw); // pass raw value to parent
  };

  useEffect(() => {
    // Sync display value when external value changes
    if (value) {
      setDisplayValue(formatWithCommas(value));
    } else {
      setDisplayValue("");
    }
  }, [value]);

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="decimal"
      value={displayValue || (value ? formatWithCommas(value) : "")}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-md px-4 py-2.5 text-sm text-white placeholder-[#4A4845] focus:outline-none focus:ring-1 focus:ring-[#C9A84C] ${className}`}
    />
  );
}
