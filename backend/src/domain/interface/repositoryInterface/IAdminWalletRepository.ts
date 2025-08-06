import { IAdminWallet } from "../../entities/adminWalletEntities"

export interface IAdminWalletRepository{
    createWallet(): Promise<IAdminWallet | null>
    updateWalletBalance(amount: number): Promise<void>   
    getwalletDetails(): Promise<IAdminWallet | null>
    checkWalletExist(): Promise<boolean>
}