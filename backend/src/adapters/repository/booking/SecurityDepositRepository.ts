import { ISecurityDepositRepository } from "../../../domain/interface/repositoryInterface/ISecurityDepositRepository";
import { setings } from "../../../domain/constants/settings";

export class SecurityDepositRepository implements ISecurityDepositRepository{
    
    async getSecurityDeposit(): Promise<number> {
        return setings.securityDeposit
    }
}
