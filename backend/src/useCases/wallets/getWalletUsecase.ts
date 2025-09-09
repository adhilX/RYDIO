import { IGetWalletUsecase } from "../../domain/interface/usecaseInterface/wallets/IGetWalletUsecase";
import { GetWalletInputDto, GetWalletOutputDto, WalletTransactionDto } from "../../domain/interface/DTOs/userDto/WalletDto";
import { IWalletRepository } from "../../domain/interface/repositoryInterface/IWalletRepository";
import { ITransaction } from "../../domain/entities/transactionEntities";

export class GetWalletUsecase implements IGetWalletUsecase {
  constructor(private _walletRepository: IWalletRepository) {
    this._walletRepository = _walletRepository;
  }

  async getWalletByUserId(input: GetWalletInputDto): Promise<GetWalletOutputDto | null> {
    try {
      const wallet = await this._walletRepository.getWalletByUserId(input.userId);
      
      if (!wallet) {
        return null;
      }

      const transactions = wallet.transactions
        ?.filter((transaction): transaction is ITransaction => typeof transaction !== 'string')
        .map((transaction): WalletTransactionDto => ({
          _id: transaction._id,
          transaction_id: transaction._id || '',
          user_id: wallet.user_id.toString(),
          amount: transaction.amount,
          transactionType: transaction.transactionType,
          purpose: transaction.purpose,
          createdAt: transaction.createdAt || new Date(),
          status: 'completed' as const,
          from: transaction.from,
          to: transaction.to,          
        }));
      return {
        _id: wallet._id!,
        user_id: wallet.user_id.toString(),
        balance: wallet.balance,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt,
        transactions
      };
    } catch (error) {
      console.error('Error in GetWalletUsecase:', error);
      throw error;
    }
  }
}