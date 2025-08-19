import { ObjectId } from "mongoose";

export interface IWallet{
    _id?:string
    user_id: string|ObjectId
    balance: number;
    is_frozen: boolean;
    transactions: string|ObjectId[]
    createdAt?:Date
    updatedAt?:Date
    }