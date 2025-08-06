import { ObjectId } from "mongoose";

export interface ITransaction {
  _id?: string; 
  from: string|ObjectId; 
  to: string|ObjectId  
  amount: number;
  purpose: 'booking' | 'refund' | 'penalty'; 
  bookingId: string|ObjectId; 
  transactionType: 'debit' | 'credit'; // debit = payment, credit =
}
