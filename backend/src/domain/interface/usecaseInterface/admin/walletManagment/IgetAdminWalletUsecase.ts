import { GetAdminWalletOutputDto } from "../../../DTOs/adminDto/AdminDto";

export interface IgetAdminWalletUsecase {
    getWalletDetails(): Promise<GetAdminWalletOutputDto | null>
}