import { AdminWalletRepository } from "../../../adapters/repository/wallet/adminWalletRepository"
import { IAdminWallet } from "../../../domain/entities/adminWalletEntities"
import { IgetAdminWalletUsecase } from "../../../domain/interface/usecaseInterface/admin/walletManagment/IgetAdminWalletUsecase"

export class GetAdminWalletUsecase implements IgetAdminWalletUsecase {
    constructor(private adminWalletRepository: AdminWalletRepository){}
    
    async getWalletDetails(): Promise<IAdminWallet|null> {
        const walletDetails = await this.adminWalletRepository.getwalletDetails()
        return walletDetails
    }
}