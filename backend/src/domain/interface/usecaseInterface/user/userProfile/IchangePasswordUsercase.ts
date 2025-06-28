import { User } from "../../../../entities/userEntities";

type Password = { current: string; newPass: string; confirm: string; _id:string };
export interface IChangePasswordUsecase {

    handleChangePassword(newpassword:Password):Promise<User|null>
}