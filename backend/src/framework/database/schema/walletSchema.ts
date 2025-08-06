import { Schema } from "mongoose";
import { IWallet } from "../../../domain/entities/walletEnties";

export const walletSchema = new Schema<IWallet>(
    {
        userId: { type: String, required: true },
        balance: { type: Number, required: true, default: 0 },
        transcations: [
            {
                type: Schema.Types.ObjectId,
                ref: 'transaction',
                required: true
            }
        ]
    }
    , { timestamps: true }
)