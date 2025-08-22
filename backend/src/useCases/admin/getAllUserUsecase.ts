import { User } from "../../domain/entities/userEntities";
import { IadminRepository } from "../../domain/interface/repositoryInterface/IadminRepository";
import { IgetAllUserUsecase } from "../../domain/interface/usecaseInterface/admin/getAllUserUsecase";

export class GetAllUserUsecase implements IgetAllUserUsecase{
    private _adminRepository: IadminRepository

    constructor(adminRepository:IadminRepository){
        this._adminRepository = adminRepository
    }

  async getAllUser(){
    const user = await this._adminRepository.getAllUsers()
    user?.map((user:User) =>{
      const{password,...rest} = user
      return rest
    })
    return user
  }
}