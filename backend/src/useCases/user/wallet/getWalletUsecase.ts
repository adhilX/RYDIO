import { IWallet } from "../../../domain/entities/walletEnties";
import { IWalletRepository } from "../../../domain/interface/repositoryInterface/IwalletRepository";
import { IgetWalletUsecase } from "../../../domain/interface/usecaseInterface/user/wallet/IgetWalletUsecase";

export class GetWalletUsecase implements IgetWalletUsecase {
    constructor(private _walletRepository:IWalletRepository) {}

    async getWalletByUserId(userId:string): Promise<IWallet | null> {
        return this._walletRepository.getWalletByUserId(userId);
    }
}