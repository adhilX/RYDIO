import { User } from "../../../../entities/userEntities";

export interface IgoogleloginUsecase {
    googleLogin(user:User):Promise<User|null>
}