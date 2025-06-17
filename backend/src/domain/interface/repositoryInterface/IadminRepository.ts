import { userSchema } from "../../../framework/database/schema/userSchema";
import { User } from "../../entities/userEntities";

export interface IadminRepository {

    findByEmail(email:string):Promise<User | null>
    getAllUsers():Promise<User[]|null>
}