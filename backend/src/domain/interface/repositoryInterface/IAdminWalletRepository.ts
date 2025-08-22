import { IAdminWallet } from "../../entities/adminWalletEntities"

export interface IAdminWalletRepository{
    createWallet(): Promise<IAdminWallet | null>
    updateWalletBalance(amount: number): Promise<void>
    updateCommissionBalance(amount: number): Promise<void>
    updatePenaltyBalance(amount: number): Promise<void>
    addTransaction(transactionId: string): Promise<void>
    getwalletDetails(): Promise<IAdminWallet | null>
    checkWalletExist(): Promise<boolean>
}