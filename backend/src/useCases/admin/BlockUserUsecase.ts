import { IadminRepository } from "../../domain/interface/repositoryInterface/IadminRepository";
import { IuserRepository } from "../../domain/interface/repositoryInterface/IuserRepository";
import { IblockUserUseCase } from "../../domain/interface/usecaseInterface/admin/IBlockUserUseCase";

export class BlockUserUseCase implements IblockUserUseCase {
    private adminRepository: IadminRepository
    constructor(adminRepository: IadminRepository) {
        this.adminRepository = adminRepository
    }
    async blockUser(clientId: string): Promise<boolean> {
        const blockedClient = await this.adminRepository.blockUser(clientId)
        if (!blockedClient) throw new Error('No client found in this email')
        return true
    }
}