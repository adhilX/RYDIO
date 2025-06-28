import { User } from "../../entities/userEntities";
import { IVehicle } from "../../entities/vehcleEnties";

export interface IadminRepository {

    findByEmail(email:string):Promise<User | null>
    getAllUsers():Promise<User[]|null>
    blockUser(userId:string):Promise<boolean|null>
    unblockUser(userId:string):Promise<boolean|null>
    SearchUser(  search: string,page: number,limit: number): Promise<{ users: User[]; total: number } | null>;
    getPendingVehicle(page:number, limit:number):Promise<{vehicles: IVehicle[]; total: number } | null >
}