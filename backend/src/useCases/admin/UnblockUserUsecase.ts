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
        
        const plainUser = JSON.parse(JSON.stringify(unblockedClient))
        const { password, ...rest } = plainUser
        const mappedUser: BaseUserOutputDto = {
            _id: rest._id,
            email: rest.email,
            name: rest.name,
            phone: rest.phone,
            role: rest.role,
            is_blocked: rest.is_blocked,
            is_verified_user: rest.is_verified_user,
            last_login: rest.last_login,
            vendor_access: rest.vendor_access,
            googleVerification: rest.googleVerification,
            profile_image: rest.profile_image,
            createdAt: rest.createdAt,
            updatedAt: rest.updatedAt
        };
        
        return {
            success: true,
            message: 'User unblocked successfully',
            user: mappedUser
        };
    }
}