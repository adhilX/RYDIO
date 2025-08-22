import { IadminRepository } from "../../domain/interface/repositoryInterface/IadminRepository";
import { IuserRepository } from "../../domain/interface/repositoryInterface/IuserRepository";
import { IunblockUserUseCase } from "../../domain/interface/usecaseInterface/admin/IunblockUserUsecase";

export class UnblockUserUseCase implements IunblockUserUseCase {
    private _adminRepository: IadminRepository
    constructor(adminRepository: IadminRepository) {
        this._adminRepository = adminRepository
    }
    async unblockUser(clientId: string): Promise<boolean> {
        const blockedClient = await this._adminRepository.unblockUser(clientId)
        if (!blockedClient) throw new Error('No client found in this email')
        return true
    }
}