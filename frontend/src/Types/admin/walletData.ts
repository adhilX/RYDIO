import type { Transaction } from "../User/walletData";

// Wallet interface based on API response
export interface WalletDetails {
  _id: string;
  balance: number;
  commission_balance: number;
  penalty_balance: number;
  total_balance: number;
  transactions: Transaction[];
}

export type TransactionType = 'all' | 'credit' | 'debit';
export type TransactionCategory = 'all' | 'commission' | 'fee' | 'subscription' | 'refund';
    