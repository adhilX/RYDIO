import { IAdminWallet } from "../../../../entities/adminWalletEntities";

export interface IgetAdminWalletUsecase {
    getWalletDetails(): Promise<IAdminWallet|null>
}