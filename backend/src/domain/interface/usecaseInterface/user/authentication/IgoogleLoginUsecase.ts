import { User } from "../../../../entities/userEntities";

export interface IgoogleloginUsecase {
    googleLogin(user: User): Promise<Omit<User, 'password'>>
}