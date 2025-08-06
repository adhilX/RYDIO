import { IWallet } from "../../../domain/entities/walletEnties";
import { IAdminWalletRepository } from "../../../domain/interface/repositoryInterface/IAdminWalletRepository";
import { IgetWalletUsecase } from "../../../domain/interface/usecaseInterface/user/wallet/IgetWalletUsecase";

export class GetWalletUsecase implements IgetWalletUsecase {
    constructor(private _adminWalletRepository: IAdminWalletRepository) {}

    async getWalletByUserId(): Promise<IWallet | null> {
        return this._adminWalletRepository.getwalletDetails();
    }
}