import { IGetAdminWalletUsecase } from "../../domain/interface/usecaseInterface/wallets/IGetAdminWalletUsecase";
import { GetAdminWalletOutputDto, WalletTransactionDto } from "../../domain/interface/DTOs/adminDto/AdminDto";
import { AdminWalletRepository } from "../../adapters/repository/wallet/adminWalletRepository";
import { ITransaction } from "../../domain/entities/transactionEntities";

export class GetAdminWalletUsecase implements IGetAdminWalletUsecase {
    constructor(private _adminWalletRepository: AdminWalletRepository){}
    
    async getWalletDetails(): Promise<GetAdminWalletOutputDto | null> {
        const walletDetails = await this._adminWalletRepository.getwalletDetails()
        if (!walletDetails) return null;
        
             const transactions = walletDetails.transactions
                ?.filter((transaction): transaction is ITransaction => typeof transaction !== 'string')
                .map((transaction): WalletTransactionDto => ({
                  _id: transaction._id,
                  transaction_id: transaction._id || '',
                  amount: transaction.amount,
                  transactionType: transaction.transactionType,
                  purpose: transaction.purpose,
                  createdAt: transaction.createdAt || new Date(),
                  status: 'completed' as const,
                  from: transaction.from,
                  to: transaction.to,          
                }));
        return {
            wallet: {
                _id: walletDetails._id!,
                balance: walletDetails.balance,
                totalEarnings: walletDetails.commission_balance,
                totalWithdrawals: walletDetails.penalty_balance,
                pendingAmount: walletDetails.total_balance,
                transactions
            }
        };
    }
}