import { WithdrawalInputDto } from "../../DTOs/userDto/WalletDto";

export interface IWithdrawUsecase {
    withdraw(input: WithdrawalInputDto): Promise<boolean>
}