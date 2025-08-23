import { WithdrawalInputDto } from "../../DTOs/userDto/WalletDto";

export interface IwithdrawUsecase {
    withdraw(input: WithdrawalInputDto): Promise<boolean>
}