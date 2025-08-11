import { ObjectId } from "mongoose";

export interface ITransaction {
  _id?: string; 
  from: string; 
  to: string;   
  amount: number;
  purpose: 'booking' | 'refund' | 'penalty' | 'deposit' | 'release' | 'commission'; 
  bookingId: string; 
  transactionType: 'debit' | 'credit'; 
}
