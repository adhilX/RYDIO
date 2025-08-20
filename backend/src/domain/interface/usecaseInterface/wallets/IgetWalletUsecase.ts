import { GetWalletInputDto, GetWalletOutputDto } from "../../DTOs/userDto/WalletDto";

export interface IgetWalletUsecase {
    getWalletByUserId(input: GetWalletInputDto): Promise<GetWalletOutputDto | null>;
}