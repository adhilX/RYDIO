import { User } from "../../../domain/entities/userEntities";
import { IadminRepository } from "../../../domain/interface/repositoryInterface/IadminRepository";
import { userModel } from "../../../framework/database/models/userModel";

export class AdminRepository implements IadminRepository {
    async findByEmail(email: string): Promise<User | null> {
        return userModel.findOne({email})
    }
    
    async getAllUsers(): Promise<User[] | null> {
        return userModel.find()
    }

    async SearchUser(search = "", page = 1, limit = 10): Promise<{ users: User[]; total: number } |null> {
  const query = search
  ?{
    $or: [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ]
  }:{}
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    userModel.find(query).skip(skip).limit(limit),
    userModel.countDocuments(query)
  ]);
  return { users, total };
}

   async blockUser(userId: string): Promise<boolean | null> {
        const blockedUser = await userModel.findByIdAndUpdate(userId, {is_blocked:true }, { new: true })
        return blockedUser?.is_blocked || null
    }
   async unblockUser(userId: string): Promise<boolean | null> {
        const blockedUser = await userModel.findByIdAndUpdate(userId, {is_blocked:false }, { new: true })
        return !blockedUser?.is_blocked || null
    }
}