import { IWallet } from "../../../../entities/walletEnties";

export interface IgetWalletUsecase {
    getWalletByUserId(userId:string): Promise<IWallet | null>;
}