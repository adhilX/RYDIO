import { IgetWalletUsecase } from "../../../domain/interface/usecaseInterface/user/wallet/IgetWalletUsecase";
import { GetWalletInputDto, GetWalletOutputDto } from "../../../domain/interface/DTOs/userDto/WalletDto";
import { IWalletRepository } from "../../../domain/interface/repositoryInterface/IwalletRepository";

export class GetWalletUsecase implements IgetWalletUsecase {
  constructor(private _walletRepository: IWalletRepository) {
    this._walletRepository = _walletRepository;
  }

  async getWalletByUserId(input: GetWalletInputDto): Promise<GetWalletOutputDto | null> {
    try {
      const wallet = await this._walletRepository.getWalletByUserId(input.userId);
      
      if (!wallet) {
        return null;
      }

      return {
        _id: wallet._id!,
        user_id: wallet.user_id.toString(),
        balance: wallet.balance,
        created_at: wallet.createdAt,
        updated_at: wallet.updatedAt
      };
    } catch (error) {
      console.error('Error in GetWalletUsecase:', error);
      throw error;
    }
  }
}