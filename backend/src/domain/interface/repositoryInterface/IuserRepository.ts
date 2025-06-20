import { User } from "../../entities/userEntities";

export interface IuserRepository{

    createUser(user:User) : Promise<User | null>
    findByEmail(email:string) :Promise<User| null>
    googleLogin(user:User):Promise<User|null>
    changePassword(id:string|undefined ,password:string):Promise<User|null>
}