import { IAdminWalletRepository } from "../../../domain/interface/repositoryInterface/IAdminWalletRepository";
import { IWalletRepository } from "../../../domain/interface/repositoryInterface/IwalletRepository";
import { ItrasationRepository } from "../../../domain/interface/repositoryInterface/ItrasationRepository";
import { IWithdrawalUsecase } from "../../../domain/interface/usecaseInterface/user/wallet/IuserWithdrawalUsecase";
import { WithdrawalInputDto, WithdrawalOutputDto } from "../../../domain/interface/DTOs/userDto/WalletDto";
import { idGeneratorService } from "../../../framework/DI/serviceInject";

export class WithdrawalUsecase implements IWithdrawalUsecase {
  constructor(
    private _adminWalletRepository: IAdminWalletRepository,
    private _walletRepository: IWalletRepository,
    private _transactionRepository: ItrasationRepository
  ) {}

  async userWithdrawal(input: WithdrawalInputDto): Promise<WithdrawalOutputDto> {
    try {
      const { userId, amount, accountDetails } = input;

      // Get user wallet
      const userWallet = await this._walletRepository.getWalletByUserId(userId);
      if (!userWallet) {
        throw new Error("User wallet not found");
      }

      // Check if user has sufficient balance
      if (userWallet.balance < amount) {
        throw new Error("Insufficient wallet balance");
      }

      // Minimum withdrawal check
      if (amount < 100) {
        throw new Error("Minimum withdrawal amount is ₹100");
      }

      // Validate account details
      if (!accountDetails.accountNumber || !accountDetails.ifscCode || !accountDetails.accountHolderName) {
        throw new Error("Complete account details are required for withdrawal");
      }

      // Generate transaction ID
      const transactionId = await idGeneratorService.generateTransactionId();

      // Create withdrawal transaction
      const withdrawalTransaction = await this._transactionRepository.create({
        from: userId,
        to: 'bank',
        amount: amount,
        purpose: 'withdrawal',
        bookingId: transactionId,
        transactionType: 'debit'
      });

      // Update user wallet (deduct amount)
      await this._walletRepository.updateWallet(userId, -amount);
      
      if (withdrawalTransaction._id) {
        await this._walletRepository.addTransaction(userId, withdrawalTransaction._id.toString());
      }

      // Reduce amount from admin wallet
      await this._adminWalletRepository.updateWalletBalance(-amount);
      if (withdrawalTransaction._id) {
        await this._adminWalletRepository.addTransaction(withdrawalTransaction._id.toString());
      }

      const updatedWallet = await this._walletRepository.getWalletByUserId(userId);
      const remainingBalance = updatedWallet?.balance || 0;

      console.log(`Withdrawal successful: ₹${amount} withdrawn for user ${userId}`);
      
      return {
        success: true,
        message: "Withdrawal request processed successfully",
        transactionId: transactionId,
        withdrawalAmount: amount,
        remainingBalance: remainingBalance
      };
            
    } catch (error) {
      console.error('Withdrawal error:', error);
      throw error;
    }
  }
}