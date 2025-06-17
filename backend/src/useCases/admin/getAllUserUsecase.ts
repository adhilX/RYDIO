import { IadminRepository } from "../../domain/interface/repositoryInterface/IadminRepository";
import { IgetAllUserUsecase } from "../../domain/interface/usecaseInterface/admin/getAllUserUsecase";

export class GetAllUserUsecase implements IgetAllUserUsecase{
    private adminRepository: IadminRepository

    constructor(adminRepository:IadminRepository){
        this.adminRepository = adminRepository
    }

  async getAllUser(){
    return this.adminRepository.getAllUsers()
  }
}