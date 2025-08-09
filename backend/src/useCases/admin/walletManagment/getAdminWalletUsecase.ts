import { AdminWalletRepository } from "../../../adapters/repository/wallet/adminWalletRepository"
import { IAdminWallet } from "../../../domain/entities/adminWalletEntities"
import { IgetAdminWalletUsecase } from "../../../domain/interface/usecaseInterface/admin/walletManagment/IgetAdminWalletUsecase"

export class GetAdminWalletUsecase implements IgetAdminWalletUsecase {
    constructor(private _adminWalletRepository: AdminWalletRepository){}
    
    async getWalletDetails(): Promise<IAdminWallet|null> {
        const walletDetails = await this._adminWalletRepository.getwalletDetails()
        return walletDetails
    }
}