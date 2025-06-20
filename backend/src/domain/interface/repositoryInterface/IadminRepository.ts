import { userSchema } from "../../../framework/database/schema/userSchema";
import { User } from "../../entities/userEntities";

export interface IadminRepository {

    findByEmail(email:string):Promise<User | null>
    getAllUsers():Promise<User[]|null>
    blockUser(userId:string):Promise<boolean|null>
    unblockUser(userId:string):Promise<boolean|null>
    SearchUser(  search: string,page: number,limit: number): Promise<{ users: User[]; total: number } | null>;
}