import { Schema } from "mongoose";
import { IWallet } from "../../../domain/entities/walletEnties";

export const walletSchema = new Schema<IWallet>(
    {
        user_id: { type: String, required: true },
        balance: { type: Number, required: true },
        transaction_history: { type: [  { type: String, required: true }], required: true },
    }
)