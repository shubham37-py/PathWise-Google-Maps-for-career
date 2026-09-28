import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Currency = "INR" | "USD" | "GBP" | "EUR";

export const FX_RATES: Record<Currency, number> = {
  INR: 1,
  USD: 0.012,     // 1 INR = ~0.012 USD (~83.3 INR/USD)
  GBP: 0.0095,    // 1 INR = ~0.0095 GBP (~105 INR/GBP)
  EUR: 0.011,     // 1 INR = ~0.011 EUR (~90.9 INR/EUR)
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: "₹",
  USD: "$",
  GBP: "£",
  EUR: "€",
};

/**
 * Format currency with tabular precision.
 * For INR: uses Lakh and Crore format when appropriate.
 * Supports live currency toggle.
 */
export function formatCurrency(
  amountInINR: number,
  currency: Currency = "INR",
  compact: boolean = true
): string {
  if (currency === "INR") {
    if (!compact) {
      return `₹${Math.round(amountInINR).toLocaleString("en-IN")}`;
    }
    const abs = Math.abs(amountInINR);
    if (abs >= 10000000) {
      const cr = amountInINR / 10000000;
      return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`;
    }
    if (abs >= 100000) {
      const lakh = amountInINR / 100000;
      return `₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(1)} Lakh`;
    }
    if (abs >= 1000) {
      const k = amountInINR / 1000;
      return `₹${k % 1 === 0 ? k.toFixed(0) : k.toFixed(0)}k`;
    }
    return `₹${Math.round(amountInINR).toLocaleString("en-IN")}`;
  }

  const converted = amountInINR * FX_RATES[currency];
  const symbol = CURRENCY_SYMBOLS[currency];

  if (!compact) {
    return `${symbol}${Math.round(converted).toLocaleString("en-US")}`;
  }

  const abs = Math.abs(converted);
  if (abs >= 1000000) {
    return `${symbol}${(converted / 1000000).toFixed(1)}M`;
  }
  if (abs >= 1000) {
    return `${symbol}${(converted / 1000).toFixed(0)}k`;
  }
  return `${symbol}${Math.round(converted).toLocaleString("en-US")}`;
}

export function formatPercent(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}
