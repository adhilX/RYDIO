import { IAdminWalletRepository } from "../../../domain/interface/repositoryInterface/IAdminWalletRepository";
import { adminWalletModel } from "../../../framework/database/models/adminWalletModel";
import { IAdminWallet } from "../../../domain/entities/adminWalletEntities";

export class AdminWalletRepository implements IAdminWalletRepository{
    async updateWalletBalance(amount: number): Promise<void> {
        await adminWalletModel.updateOne({},{
            $inc:{balance:amount}
        })
    }
    async getwalletDetails(): Promise<IAdminWallet | null> {
        return await adminWalletModel.findOne()
    }
}