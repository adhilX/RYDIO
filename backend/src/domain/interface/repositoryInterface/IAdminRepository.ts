import { IVerificationRequest } from "../../entities/VerificationRequest";
import { User } from "../../entities/userEntities";
import { IVehicle } from "../../entities/vehcleEnties";
import { IBaseRepository } from "../repositoryInterface/IbaseRepo";

export interface IAdminRepository extends IBaseRepository<User> {
    getAllUsers():Promise<User[]|null>
    blockUser(userId:string):Promise<boolean|null>
    unblockUser(userId:string):Promise<boolean|null>
    SearchUser(  search: string,page: number,limit: number): Promise<{ users: User[]; total: number } | null>;
    getPendingVehicle(page:number, limit:number):Promise<{vehicles: IVehicle[]; total: number } | null >
    getApprovedVehicle(search:string,page:number, limit:number):Promise<{vehicles: IVehicle[]; total: number,totalCount:number } | null >
    getIdProof(status:'pending'|'approved'|'rejected',page:number,limit:number):Promise<{idProof:IVerificationRequest[]; total:number }| null> 
    findByIdProof(idProof_id:string[]):Promise<User[]>
    idProofUprove(idProof_id:string,owner_id:string):Promise<boolean>
    idProofReject(idProof_id:string,reason:string):Promise<boolean>
    setVeifedUser(userId:string):Promise<boolean>
    vendorAccess(userId:string,vendor_access:boolean):Promise<boolean>
}