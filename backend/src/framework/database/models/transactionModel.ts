import { model } from "mongoose";
import { ITransaction } from "../../../domain/entities/transactionEntities";
import { ObjectId } from "mongoose";
import { transactionSchema } from "../schema/transactionSchema";

export interface ITransactionModel extends Omit<ITransaction, '_id'>, Document {
  _id: ObjectId
}
export const transactionModel = model<ITransaction>('transaction', transactionSchema);