import { User } from "../../../../entities/userEntities";

export interface IcreateUserUsecase{
    createUser(user:User):Promise<User | null>
}