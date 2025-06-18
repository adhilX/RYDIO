import { User } from "../../../../entities/userEntities";

export interface IchangePasswordUsecase {
    ChangePassword(email: string , newPassword:string): Promise<User>;
}
