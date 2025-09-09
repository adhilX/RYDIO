import { GetWalletInputDto, GetWalletOutputDto } from "../../DTOs/userDto/WalletDto";

export interface IGetWalletUsecase {
    getWalletByUserId(input: GetWalletInputDto): Promise<GetWalletOutputDto | null>;
}