import { User } from "../../../domain/entities/userEntities";
import { IVehicle } from "../../../domain/entities/vehcleEnties";
import { IadminRepository } from "../../../domain/interface/repositoryInterface/IadminRepository";
import { userModel } from "../../../framework/database/models/userModel";
import { VehicleModel } from "../../../framework/database/models/vehicleModel";

export class AdminRepository implements IadminRepository {
  async findByEmail(email: string): Promise<User | null> {
    return userModel.findOne({ email })
  }

  async getAllUsers(): Promise<User[] | null> {
    return userModel.find()
  }

  async SearchUser(search = "", page = 1, limit = 10): Promise<{ users: User[]; total: number } | null> {
    const query = search
      ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      } : {}
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      userModel.find(query).skip(skip).limit(limit),
      userModel.countDocuments(query)
    ]);
    return { users, total };
  }

  async blockUser(userId: string): Promise<boolean | null> {
    const blockedUser = await userModel.findByIdAndUpdate(userId, { is_blocked: true }, { new: true })
    return blockedUser?.is_blocked || null
  }
  async unblockUser(userId: string): Promise<boolean | null> {
    const blockedUser = await userModel.findByIdAndUpdate(userId, { is_blocked: false }, { new: true })
    return !blockedUser?.is_blocked || null
  }

  async getPendingVehicle(page = 1, limit = 10): Promise<{ vehicles: IVehicle[]; total: number } | null> {
  const skip = (page - 1) * limit;
  const filter = { admin_approve: { $ne: 'accepted' } };

  const [vehicles, total] = await Promise.all([
    VehicleModel.find(filter).populate('owner_id').populate('location_id').skip(skip).limit(limit),
    VehicleModel.countDocuments(filter)
  ]);
  return { vehicles, total };
}
  async getApprovedVehicle(page = 1, limit = 10): Promise<{ vehicles: IVehicle[]; total: number } | null> {
  const skip = (page - 1) * limit;
  const filter = { admin_approve: 'accepted'};

  const [vehicles, total] = await Promise.all([
    VehicleModel.find(filter).populate('owner_id').populate('location_id').skip(skip).limit(limit),
    VehicleModel.countDocuments(filter)
  ]);
  return { vehicles, total };
}
    async findById(_id:string):Promise<User|null>{
    return await userModel.findById(_id)
    }
}


