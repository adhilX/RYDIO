import { IAdminRepository } from "../../domain/interface/repositoryInterface/IAdminRepository";
import { IIdProofActionUsecase } from "../../domain/interface/usecaseInterface/admin/IIdProofActionUsecase";
import { IdProofActionInputDto, IdProofActionOutputDto } from "../../domain/interface/DTOs/adminDto/AdminDto";

export class IdProofActionUsecase implements IIdProofActionUsecase{

    constructor(private _adminRepository :IAdminRepository){
        this._adminRepository = _adminRepository
    }

    async setAction(input: IdProofActionInputDto): Promise<IdProofActionOutputDto> {
        
        if(input.action == 'approved'){
            await this._adminRepository.setVeifedUser(input.owner_id)
            await this._adminRepository.idProofUprove(input.idProof_id, input.owner_id)
            return {
                success: true,
                message: 'ID proof approved successfully'
            };
        }
        await this._adminRepository.idProofReject(input.idProof_id, input.reason)
        return {
            success: true,
            message: 'ID proof rejected successfully'
        };
    }
} 