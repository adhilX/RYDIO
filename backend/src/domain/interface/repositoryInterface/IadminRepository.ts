import { IVerificationRequest } from "../../entities/IVerificationRequest";
import { User } from "../../entities/userEntities";
import { IVehicle } from "../../entities/vehcleEnties";

export interface IadminRepository {

    findByEmail(email:string):Promise<User | null>
    getAllUsers():Promise<User[]|null>
    findById(_id:string):Promise<User|null>
    blockUser(userId:string):Promise<boolean|null>
    unblockUser(userId:string):Promise<boolean|null>
    SearchUser(  search: string,page: number,limit: number): Promise<{ users: User[]; total: number } | null>;
    getPendingVehicle(page:number, limit:number):Promise<{vehicles: IVehicle[]; total: number } | null >
    getApprovedVehicle(search:string,page:number, limit:number):Promise<{vehicles: IVehicle[]; total: number } | null >
    getIdProof(status:'pending'|'approved'|'rejected',page:number,limit:number):Promise<{idProof:IVerificationRequest[]; total:number }| null> 
    findByIdProof(idProof_id:string[]):Promise<User[]>
    idProofUprove(idProof_id:string,owner_id:string):Promise<boolean>
    idProofReject(idProof_id:string):Promise<boolean>
    setVeifedUser(userId:string):Promise<boolean>
    vendorAccess(userId:string,vendorAccess:boolean):Promise<boolean>
}