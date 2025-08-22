import { IadminRepository } from "../../domain/interface/repositoryInterface/IadminRepository";
import { IidProofActionUsecase } from "../../domain/interface/usecaseInterface/admin/IidProofActionUsecase";

export class IdProofActionUsecase implements IidProofActionUsecase{

    constructor(private _adminRepository :IadminRepository){
        this._adminRepository = _adminRepository
    }

    async setAction(idProof_id: string,owner_id:string, action: "rejected" | "approved",reason:string): Promise<boolean> {
        
        if(action == 'approved'){
            await this._adminRepository.setVeifedUser(owner_id)
          return  await this._adminRepository.idProofUprove(idProof_id,owner_id)
        }
        return await this._adminRepository.idProofReject(idProof_id,reason)
    }
} 