import { IWallet } from "../../../domain/entities/walletEnties";
import { IWalletRepository } from "../../../domain/interface/repositoryInterface/IwalletRepository";
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
}
