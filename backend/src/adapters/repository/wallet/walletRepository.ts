import { IWallet } from "../../../domain/entities/walletEnties";
import { IWalletRepository } from "../../../domain/interface/repositoryInterface/IwalletRepository";
import { WalletModel } from "../../../framework/database/models/walletModel";

export class WalletRepository implements IWalletRepository {

  async createWallet(userId: string): Promise<IWallet> {
    const newWallet = new WalletModel({ user_id: userId, balance: 0 });
    return await newWallet.save();
  }
  async getWalletById(walletId: string): Promise<IWallet | null> {
    return await WalletModel.findById(walletId)
  }

  async getWalletByUserId(userId: string): Promise<IWallet | null> {
    return await WalletModel.findOne({ user_id: userId }).populate('transactions')
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
}
