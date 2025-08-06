import { model } from "mongoose";
import { adminWalletSchema } from "../schema/adminWalletSchema";
import { ObjectId } from "mongoose";
import { IAdminWallet } from "../../../domain/entities/adminWalletEntities";
export interface IAdminWalletModel extends Omit<IAdminWallet,'_id'>,Document{  
    _id:ObjectId
}
export const adminWalletModel = model<IAdminWallet>('adminWallet', adminWalletSchema);