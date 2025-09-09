import { User } from "../../domain/entities/userEntities";
import { IAdminRepository } from "../../domain/interface/repositoryInterface/IAdminRepository";
import { IgetIdProofUscase } from "../../domain/interface/usecaseInterface/admin/IgetIdProofUscase";
// import { GetIdProofInputDto, GetIdProofOutputDto, BaseUserOutputDto } from "../../domain/interface/DTOs/adminDto/AdminDto";

export class GetIdProofUscase implements IgetIdProofUscase{
    constructor(private _adminRepository :IAdminRepository){
        this._adminRepository = _adminRepository
    }
    async getIdProof(status:'pending' | 'approved' | 'rejected',currentPage:number,itemsPerPage:number): Promise<{idproofs:User[];total:number} | null> {
        const {idProof,total}  = await this._adminRepository.getIdProof(status,currentPage,itemsPerPage)?? {idProof: [], total: 0,}; ;
        const ids = idProof.map((proof) => proof._id!.toString());
        
         const idproofs =  await this._adminRepository.findByIdProof(ids);
         return {idproofs,total}
      }
}