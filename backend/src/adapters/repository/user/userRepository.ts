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
    async findById(_id:string){
    return await userModel.findById(_id)
    }
    
    async googleLogin(user: User): Promise<User | null> {
        return await userModel.create(user)
    }
      async changePassword(id: string, password: string): Promise<User | null> {
     return await userModel.findByIdAndUpdate(id, { password }, { new: true })
      }
      async updateProfile(email: string, phone: string, name:string,profile_image:string): Promise<User | null> {
     return await userModel.findOneAndUpdate({email}, { phone,name,profile_image }, { new: true })
      }
}