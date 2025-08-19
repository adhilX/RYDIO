import { IadminRepository } from "../../domain/interface/repositoryInterface/IadminRepository";
import { IvendorAccessUsecase } from "../../domain/interface/usecaseInterface/admin/IvendorAccessUsecase";
import { VendorAccessInputDto, VendorAccessOutputDto } from "../../domain/interface/DTOs/adminDto/AdminDto";

export class VendorAccessUsecase implements IvendorAccessUsecase{
    private _adminRepository:IadminRepository
    constructor(adminRepository:IadminRepository) {
        this._adminRepository = adminRepository
    }

 async vendorAccess(input: VendorAccessInputDto): Promise<VendorAccessOutputDto>{
    if(!input.userId) throw new Error('user id is required')
        if(typeof input.vendorAccess !== 'boolean') throw new Error('vendor access is required')
    await this._adminRepository.vendorAccess(input.userId, input.vendorAccess)
    return {
        success: true,
        message: `Vendor access ${input.vendorAccess ? 'granted' : 'revoked'} successfully`
    };
 }
}