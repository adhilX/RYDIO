import { IadminRepository } from "../../domain/interface/repositoryInterface/IadminRepository";
import { IvendorAccessUsecase } from "../../domain/interface/usecaseInterface/admin/IvendorAccessUsecase";

export class VendorAccessUsecase implements IvendorAccessUsecase{
    private adminRepository:IadminRepository
    constructor(adminRepository:IadminRepository) {
        this.adminRepository = adminRepository
    }

 async vendorAccess(userId:string,vendorAccess:boolean):Promise<boolean>{
    if(!userId) throw new Error('user id is required')
        if(typeof vendorAccess !== 'boolean') throw new Error('vendor access is required')
    return await this.adminRepository.vendorAccess(userId,vendorAccess)
 }
}