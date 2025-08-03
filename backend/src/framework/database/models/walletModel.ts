import { model } from "mongoose";
import { IWallet } from "../../../domain/entities/walletEnties";
import { walletSchema } from "../schema/walletSchema";
import { Document, ObjectId } from "mongoose";

export interface IWalletModel extends Omit<IWallet, '_id'>, Document {
    _id: ObjectId;
}
export const WalletModel = model<IWallet>('Wallet', walletSchema);