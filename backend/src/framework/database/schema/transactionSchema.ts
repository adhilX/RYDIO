import { Schema, Types } from 'mongoose';
import { ITransaction } from '../../../domain/entities/transactionEntities';


export const transactionSchema= new Schema<ITransaction>({
  from: {type: Types.ObjectId,required: true,ref: 'user',},
  to: {type: Types.ObjectId,required: true,ref: 'user',},
  amount: {type: Number,required: true,},
  bookingId: {type: Types.ObjectId,ref: 'booking',required: true },
  transactionType: {type: String,enum: ['debit', 'credit'],default: 'debit',},
  purpose: {type: String,enum: ['booking', 'refund', 'penalty', 'deposit', 'release', 'commission'], default: 'booking',},
},{timestamps:true});