import { User } from "../../../../entities/userEntities";

export interface IloginUserUsecase {
    loginUser(email:string, password: string):Promise<User|null>
}