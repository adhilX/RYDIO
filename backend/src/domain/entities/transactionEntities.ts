import { ObjectId } from "mongoose";

export interface ITransaction{
  _id?: ObjectId; 
  wallet_id: string
  amount: number
  payment_type: 'booking' | 'refund' 
  payment_status: 'debit' | 'credit'
}