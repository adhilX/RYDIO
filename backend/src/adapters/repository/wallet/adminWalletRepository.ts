import { IAdminWalletRepository } from "../../../domain/interface/repositoryInterface/IAdminWalletRepository";
import { adminWalletModel } from "../../../framework/database/models/adminWalletModel";
import { IAdminWallet } from "../../../domain/entities/adminWalletEntities";

export class AdminWalletRepository implements IAdminWalletRepository{
    async createWallet(): Promise<IAdminWallet | null>  {
        return await adminWalletModel.create({
            balance: 0,
            commission_balance: 0,
            penalty_balance: 0,
            total_balance: 0,
            transactions: []
        })
    }
    
    async updateWalletBalance(amount: number): Promise<void> {
        await adminWalletModel.updateOne({}, {
            $inc: { 
                balance: amount,
                total_balance: amount
            }
        })
    }
    
    async updateCommissionBalance(amount: number): Promise<void> {
        await adminWalletModel.updateOne({}, {
            $inc: { 
                commission_balance: amount,
                total_balance: amount
            }
        })
    }
    
    async updatePenaltyBalance(amount: number): Promise<void> {
        await adminWalletModel.updateOne({}, {
            $inc: { 
                penalty_balance: amount,
                total_balance: amount
            }
        })
    }
    
    async addTransaction(transactionId: string): Promise<void> {
        await adminWalletModel.updateOne({}, {
            $push: { transactions: transactionId }
        })
    }
    async getwalletDetails(): Promise<IAdminWallet | null> {
        const wallets = await adminWalletModel.find().populate('transactions');
        
        if (wallets.length === 0) {
            return null;
        }
        
        return wallets[0]
    }
    async checkWalletExist(): Promise<boolean> {
        return await adminWalletModel.countDocuments() > 0
    }
}