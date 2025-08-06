import { ObjectId } from "mongoose";

export interface IWallet{
    userId: string|ObjectId
    balance: number;
    is_frozen: boolean;
    transactions: string|ObjectId[]
    }