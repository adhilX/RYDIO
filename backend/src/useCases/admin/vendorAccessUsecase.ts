import { IAdminRepository } from "../../domain/interface/repositoryInterface/IAdminRepository";
import { IVendorAccessUsecase } from "../../domain/interface/usecaseInterface/admin/IVendorAccessUsecase";
import { VendorAccessInputDto, VendorAccessOutputDto } from "../../domain/interface/DTOs/adminDto/AdminDto";

export class VendorAccessUsecase implements IVendorAccessUsecase{
    private _adminRepository:IAdminRepository
    constructor(adminRepository:IAdminRepository) {
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