import { Schema } from "mongoose";
import { ITransaction } from "../../../domain/entities/transactionEntities";
export const transactionSchema = new Schema<ITransaction>({
  wallet_id: { type: String, required: true },
  amount: { type: Number, required: true },
  payment_type: { type: String, enum: ['booking', 'refund'], required: true },
  payment_status: { type: String, enum: ['debit', 'credit'], required: true }
},{timestamps:true})