import { Types } from 'mongoose';

export interface ITransaction {
  userId: Types.ObjectId;
  bookingId: Types.ObjectId;
  amount: number;
  paymentMethod: 'card' | 'wallet';
  transactionType: 'debit' | 'credit'; // debit = payment, credit = refund
}
