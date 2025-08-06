import { IWallet } from "../../entities/walletEnties";

export interface IWalletRepository {
    createWallet(userId: string): Promise<IWallet>;

    getWalletById(walletId: string): Promise<IWallet | null>;
    getWalletByUserId(userId: string): Promise<IWallet | null>;
    updateWalletBalance(userId: string, amount: number): Promise<IWallet | null>;
}