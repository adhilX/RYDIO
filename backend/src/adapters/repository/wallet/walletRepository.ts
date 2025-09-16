import { IWallet } from "../../../domain/entities/walletEnties";
import { IWalletRepository } from "../../../domain/interface/repositoryInterface/IWalletRepository";
import { WalletModel } from "../../../framework/database/models/walletModel";
import { BaseRepository } from "../base/BaseRepo";

export class WalletRepository extends BaseRepository<IWallet> implements IWalletRepository {
  constructor() {
    super(WalletModel);
  }

  async getWalletById(walletId: string): Promise<IWallet | null> {
    return await this.findById(walletId);
  }

  async getWalletByUserId(userId: string): Promise<IWallet | null> {
  const wallet = await WalletModel.findOne({ user_id: userId }).populate('transactions')
    console.log(wallet)
    return wallet
  }

  async updateWalletBalance(userId: string, amount: number): Promise<IWallet | null> {
    return await WalletModel.findOneAndUpdate(
      { user_id: userId},
      { $inc: { balance: amount } },
      { new: true }
    )
  }
  async updateWallet(userId: string, amount: number): Promise<IWallet | null> {
    return await WalletModel.findOneAndUpdate(
      { user_id: userId},
      { $inc: { balance: amount } },
      { new: true }
    )
  }

  async addTransaction(userId: string, transactionId: string): Promise<IWallet | null> {
    return await WalletModel.findOneAndUpdate(
      { user_id: userId },
      { $push: { transactions: transactionId } },
      { new: true }
    )
  }

  // Dashboard Analytics Method
  async getAdminWalletBalance(): Promise<number> {
    // Calculate total admin wallet balance from all transactions
    const result = await WalletModel.aggregate([
      {
        $group: {
          _id: null,
          totalBalance: { $sum: "$balance" }
        }
      }
    ]);
    
    return result.length > 0 ? result[0].totalBalance : 0;
  }
}
