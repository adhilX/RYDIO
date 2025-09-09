import { IAdminRepository } from "../../domain/interface/repositoryInterface/IAdminRepository";
import { IUnblockUserUsecase } from "../../domain/interface/usecaseInterface/admin/IUnblockUserUsecase";
import { UnblockUserInputDto, UnblockUserOutputDto } from "../../domain/interface/DTOs/adminDto/AdminDto";

export class UnblockUserUseCase implements IUnblockUserUsecase {
    private _adminRepository: IAdminRepository
    constructor(adminRepository: IAdminRepository) {
        this._adminRepository = adminRepository
    }
    async unblockUser(input: UnblockUserInputDto): Promise<UnblockUserOutputDto> {
        const isUnblocked = await this._adminRepository.unblockUser(input.userId)
        if (!isUnblocked) throw new Error('Failed to unblock user or user not found')
        
        return {
            success: true,
            message: 'User unblocked successfully',
        };
    }
}