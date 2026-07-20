import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortAddress(address: string): string {
  return `${address.slice(0, 6)}···${address.slice(-4)}`;
}

export function formatAvax(amount: number): string {
  return amount.toLocaleString("en-US", { maximumFractionDigits: 2 });
}
