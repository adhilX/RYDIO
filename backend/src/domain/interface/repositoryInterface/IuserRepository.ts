import { User } from "../../entities/userEntities";

export interface IuserRepository{

    createUser(user:User) : Promise<User | null>
    findByEmail(email:string) :Promise<User| null>
}