import { User } from "../../domain/entities/userEntities";
import { IadminRepository } from "../../domain/interface/repositoryInterface/IadminRepository";
import { IgetIdProofUscase } from "../../domain/interface/usecaseInterface/admin/IgetIdProofUscase";

export class GetIdProofUscase implements IgetIdProofUscase{
    constructor(private adminRepository :IadminRepository){
        this.adminRepository = adminRepository
    }
async getIdProof(status:'pending' | 'approved' | 'rejected',currentPage:number,itemsPerPage:number): Promise<{idproofs:User[];total:number} | null> {
  const {idProof,total}  = await this.adminRepository.getIdProof(status,currentPage,itemsPerPage)?? {idProof: [], total: 0,}; ;
  const ids = idProof.map((proof) => proof._id!.toString());
  
   const idproofs =  await this.adminRepository.findByIdProof(ids);
   return {idproofs,total}
}
}