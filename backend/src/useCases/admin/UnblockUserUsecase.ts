import { User } from "../../domain/entities/userEntities";
import { IadminRepository } from "../../domain/interface/repositoryInterface/IadminRepository";
import { IunblockUserUseCase } from "../../domain/interface/usecaseInterface/admin/IunblockUserUsecase";
import { UnblockUserInputDto, UnblockUserOutputDto, BaseUserOutputDto } from "../../domain/interface/DTOs/adminDto/AdminDto";

export class UnblockUserUseCase implements IunblockUserUseCase {
    private _adminRepository: IadminRepository
    constructor(adminRepository: IadminRepository) {
        this._adminRepository = adminRepository
    }
    async unblockUser(input: UnblockUserInputDto): Promise<UnblockUserOutputDto> {
        const unblockedClient = await this._adminRepository.unblockUser(input.userId)
        if (!unblockedClient) throw new Error('No user found with this ID')
        
     
        
        return {
            success: true,
            message: 'User unblocked successfully',
        };
    }
}