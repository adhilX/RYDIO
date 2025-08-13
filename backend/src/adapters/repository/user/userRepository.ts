import { User } from "../../../domain/entities/userEntities";
import { IuserRepository } from "../../../domain/interface/repositoryInterface/IuserRepository";
import { userModel } from "../../../framework/database/models/userModel";
import { BaseRepository } from "../base/BaseRepo";

export class UserRepository extends BaseRepository<User> implements IuserRepository{
    constructor() {
        super(userModel);
    }
    async findByEmail(email:string):Promise<User|null>{
    return await userModel.findOne({email}).populate('idproof_id')
    }
    async findById(_id:string):Promise<User|null>{
    return await userModel.findOne({_id,role:'user'}).populate('idproof_id')
    }
    
    async googleLogin(user: User): Promise<User | null> {
        return await userModel.create(user)
    }
      async changePassword(id: string, password: string): Promise<User | null> {
     return await userModel.findByIdAndUpdate(id, { password }, { new: true })
      }
      async updateProfile(email: string, phone: string, name:string,profile_image:string): Promise<User | null> {
     return await userModel.findOneAndUpdate({email}, { phone,name,profile_image }, { new: true }).populate('idproof_id')
      }

      async findStatusForMidddlewere(userId: string): Promise<string> {
          const user = await userModel.findById(userId)
          if(!user)throw new Error('no user found this id')
            return String(user.is_blocked)
      }
}