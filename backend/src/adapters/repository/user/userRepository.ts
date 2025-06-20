import { User } from "../../../domain/entities/userEntities";
import { IuserRepository } from "../../../domain/interface/repositoryInterface/IuserRepository";
import { userModel } from "../../../framework/database/models/userModel";

export class UserRepostory implements IuserRepository{
    async createUser(user: User): Promise<User | null> {
       return await userModel.create(user)
    }

    async findByEmail(email:string){
    return await userModel.findOne({email})
    }
}