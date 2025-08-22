import { IgetSecurityDepositUsecase } from "../../domain/interface/usecaseInterface/user/booking/IgetSecurityDepositUsecase";
import { ISecurityDepositRepository } from "../../domain/interface/repositoryInterface/ISecurityDepositRepository";

export class GetSecurityDepositUsecase implements IgetSecurityDepositUsecase{
    
constructor(private _SecurityDepositRepository: ISecurityDepositRepository){}

async getSecurityDeposit(): Promise<number> {
    return this._SecurityDepositRepository.getSecurityDeposit()
}
}