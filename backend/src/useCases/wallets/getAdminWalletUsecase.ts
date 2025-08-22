import { IgetAdminWalletUsecase } from "../../domain/interface/usecaseInterface/wallets/IgetAdminWalletUsecase";
import { GetAdminWalletOutputDto } from "../../domain/interface/DTOs/adminDto/AdminDto";
import { AdminWalletRepository } from "../../adapters/repository/wallet/adminWalletRepository";

export class GetAdminWalletUsecase implements IgetAdminWalletUsecase {
    constructor(private _adminWalletRepository: AdminWalletRepository){}
    
    async getWalletDetails(): Promise<GetAdminWalletOutputDto | null> {
        const walletDetails = await this._adminWalletRepository.getwalletDetails()
        if (!walletDetails) return null;
        
        return {
            wallet: {
                _id: walletDetails._id!,
                balance: walletDetails.balance,
                totalEarnings: walletDetails.commission_balance,
                totalWithdrawals: walletDetails.penalty_balance,
                pendingAmount: walletDetails.total_balance
            }
        };
    }
}