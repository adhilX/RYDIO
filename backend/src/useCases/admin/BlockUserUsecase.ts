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
        
     
        return {
            success: true,
            message: 'User blocked successfully',
        };
    }
}