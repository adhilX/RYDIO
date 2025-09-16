import { IWallet } from "../../entities/walletEnties";
import { IBaseRepository } from "./IbaseRepo";

export interface IWalletRepository extends IBaseRepository<IWallet>{
    getWalletById(walletId: string): Promise<IWallet | null>;
    getWalletByUserId(userId: string): Promise<IWallet | null>;
    updateWalletBalance(userId: string, amount: number): Promise<IWallet | null>;
    updateWallet(userId: string, amount: number): Promise<IWallet | null>;
    addTransaction(userId: string, transactionId: string): Promise<IWallet | null>;
    
    // Dashboard Analytics Methods
    getAdminWalletBalance(): Promise<number>;
}