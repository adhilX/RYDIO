import { User } from "../../domain/entities/userEntities";
import { IadminRepository } from "../../domain/interface/repositoryInterface/IadminRepository";
import { IblockUserUseCase } from "../../domain/interface/usecaseInterface/admin/IBlockUserUseCase";
import { BlockUserInputDto, BlockUserOutputDto, BaseUserOutputDto } from "../../domain/interface/DTOs/adminDto/AdminDto";

export class BlockUserUseCase implements IblockUserUseCase {
    private _adminRepository: IadminRepository
    constructor(adminRepository: IadminRepository) {
        this._adminRepository = adminRepository
    }
    async blockUser(input: BlockUserInputDto): Promise<BlockUserOutputDto> {
        const blockedClient = await this._adminRepository.blockUser(input.userId)
        if (!blockedClient) throw new Error('No user found with this ID')
        
        const plainUser = JSON.parse(JSON.stringify(blockedClient))
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
            message: 'User blocked successfully',
            user: mappedUser
        };
    }
}