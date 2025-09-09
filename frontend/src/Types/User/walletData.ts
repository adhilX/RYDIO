export interface Transaction {
    _id: string;
    from: string;
    to: string;
    amount: number;
    bookingId?: string;
    transactionType: 'credit' | 'debit';
    purpose: string;
    createdAt: string;
    updatedAt: string;
  }
  
export interface WalletData {
    _id: string;
    user_id: string;
    balance: number;
    is_frozen: boolean;
    transactions: Transaction[];
    createdAt: string;
    updatedAt: string;
}