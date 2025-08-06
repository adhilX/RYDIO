import { IAdminWallet } from "../../entities/adminWalletEntities"

export interface IAdminWalletRepository{
    updateWalletBalance(amount: number): Promise<void>   
    getwalletDetails(): Promise<IAdminWallet | null>
}