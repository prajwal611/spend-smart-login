
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

// Adding this helper function for consistent type checking
export type TransactionType = 'expense' | 'income' | 'all';

export function isValidTransactionType(value: string): value is TransactionType {
  return ['expense', 'income', 'all'].includes(value);
}
