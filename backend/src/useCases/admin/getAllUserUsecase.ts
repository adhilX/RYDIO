import { User } from "../../domain/entities/userEntities";
import { IadminRepository } from "../../domain/interface/repositoryInterface/IadminRepository";
import { IgetAllUserUsecase } from "../../domain/interface/usecaseInterface/admin/getAllUserUsecase";

export class GetAllUserUsecase implements IgetAllUserUsecase{
    private adminRepository: IadminRepository

    constructor(adminRepository:IadminRepository){
        this.adminRepository = adminRepository
    }

  async getAllUser(){
    const user = await this.adminRepository.getAllUsers()
    user?.map((user:User) =>{
      const{password,...rest} = user
      return rest
    })
    return user
  }
}