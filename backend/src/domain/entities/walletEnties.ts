import { ObjectId } from "mongoose";
import { ITransaction } from "./transactionEntities";

export interface IWallet{
    _id?:string
    user_id: string|ObjectId
    balance: number;
    is_frozen: boolean;
    transactions: string[] | ITransaction[]
    createdAt?:Date
    updatedAt?:Date
    }