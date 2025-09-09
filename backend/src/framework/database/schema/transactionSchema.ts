import { Schema } from 'mongoose';
import { ITransaction } from '../../../domain/entities/transactionEntities';
import { TransactionPurpose } from '../../../domain/entities/transactionEntities';

export const transactionSchema= new Schema<ITransaction>({
  from: {type:String,required: true}, 
  to: {type: String,required: true},   
  amount: {type: Number,required: true,},
  bookingId: {type: String,required: true }, 
  transactionType: {type: String,enum: ['debit', 'credit'],default: 'debit',},
  purpose: {type: String,enum: Object.values(TransactionPurpose), default: TransactionPurpose.booking,},
},{timestamps:true});