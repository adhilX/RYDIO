// User Wallet DTOs

//=================== Get Wallet DTOs ===================

export interface GetWalletInputDto {
  userId: string;
}

export interface GetWalletOutputDto {
  _id?: string;
  user_id: string;
  balance: number;
  created_at?: Date;
  updated_at?: Date;
}

  //=================== Withdrawal DTOs ===================

export interface WithdrawalInputDto {
  userId: string;
   bookingId: string;
}

//=================== Wallet Transaction DTOs ===================

export interface WalletTransactionInputDto {
  userId: string;
  page: number;
  limit: number;
}

export interface WalletTransactionDto {
  _id?: string;
  transaction_id: string;
  user_id: string;
  amount: number;
  type: 'credit' | 'debit';
  purpose: string;
  created_at: Date;
  status: 'pending' | 'completed' | 'failed';
}

export interface WalletTransactionOutputDto {
  transactions: WalletTransactionDto[];
  total: number;
  currentPage: number;
  totalPages: number;
}

//=================== Withdrawal DTOs ===================

export interface WithdrawalInputDto {
  bookingId: string;
  userId: string;
}
