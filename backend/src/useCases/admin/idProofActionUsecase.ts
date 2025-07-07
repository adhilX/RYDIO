import { IadminRepository } from "../../domain/interface/repositoryInterface/IadminRepository";
import { IidProofActionUsecase } from "../../domain/interface/usecaseInterface/admin/IidProofActionUsecase";

export class IdProofActionUsecase implements IidProofActionUsecase{

    constructor(private adminRepository :IadminRepository){
        this.adminRepository = adminRepository
    }

    async setAction(idProof_id: string,owner_id:string, action: "rejected" | "approved"): Promise<boolean> {
        
        if(action == 'approved'){
            await this.adminRepository.setVeifedUser(owner_id)
          return  await this.adminRepository.idProofUprove(idProof_id,owner_id)
        }
        return await this.adminRepository.idProofReject(idProof_id)
    }
} 