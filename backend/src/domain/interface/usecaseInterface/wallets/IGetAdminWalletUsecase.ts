import { GetAdminWalletOutputDto } from "../../DTOs/adminDto/AdminDto";

export interface IGetAdminWalletUsecase {
    getWalletDetails(): Promise<GetAdminWalletOutputDto | null>
}