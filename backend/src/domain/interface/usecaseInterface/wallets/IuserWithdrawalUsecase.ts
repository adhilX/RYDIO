import { WithdrawalInputDto, WithdrawalOutputDto } from "../../DTOs/userDto/WalletDto";

export interface IWithdrawalUsecase {
 userWithdrawal(input: WithdrawalInputDto): Promise<WithdrawalOutputDto>
}