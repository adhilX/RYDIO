
export enum TransactionPurpose {
    booking = 'booking',
    refund = 'refund',
    deposit = 'deposit',
    withdraw = 'withdraw',
    
}

export interface ITransaction {
  _id?: string; 
  from: string; 
  to: string;   
  amount: number;
  purpose: TransactionPurpose; 
  bookingId: string; 
  transactionType: 'debit' | 'credit'; 
}
