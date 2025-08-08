import { ObjectId } from "mongoose";

export interface IWallet{
    user_id: string|ObjectId
    balance: number;
    is_frozen: boolean;
    transactions: string|ObjectId[]
    }