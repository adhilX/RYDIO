import { IAdminRepository } from "../../domain/interface/repositoryInterface/IAdminRepository";
import { IBlockUserUseCase } from "../../domain/interface/usecaseInterface/admin/IBlockUserUseCase";
import { BlockUserInputDto, BlockUserOutputDto } from "../../domain/interface/DTOs/adminDto/AdminDto";

export class BlockUserUseCase implements IBlockUserUseCase {
    private _adminRepository: IAdminRepository
    constructor(adminRepository: IAdminRepository) {
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