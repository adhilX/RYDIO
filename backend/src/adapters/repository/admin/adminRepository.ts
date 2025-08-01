import { IVerificationRequest } from "../../../domain/entities/IVerificationRequest";
import { User } from "../../../domain/entities/userEntities";
import { IVehicle } from "../../../domain/entities/vehcleEnties";
import { IadminRepository } from "../../../domain/interface/repositoryInterface/IadminRepository";
import { userModel } from "../../../framework/database/models/userModel";
import { VehicleModel } from "../../../framework/database/models/vehicleModel";
import { verificationRequestModel } from "../../../framework/database/models/verificationRequestModel";

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
  async getApprovedVehicle(search='',page = 1, limit = 10): Promise<{ vehicles: IVehicle[]; total: number } | null> {
  const skip = (page - 1) * limit;
  console.log(search)
  const searchFilter = search
  ? {
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } }
        ]
      }
      : {};
      const filter = { admin_approve: 'accepted',...searchFilter};
  const [vehicles, total] = await Promise.all([
    VehicleModel.find(filter).populate('owner_id').populate('location_id').skip(skip).limit(limit),
    VehicleModel.countDocuments(filter)
  ]);
  return { vehicles, total };
}

    async findById(_id:string):Promise<User|null>{
    return await userModel.findOne({_id,role:'admin'})
    }
 async getIdProof(status: "pending" | "approved" | "rejected", page: number, limit: number): Promise<{idProof:IVerificationRequest[]; total:number }| null> {

    const skip = (page - 1) * limit;
    const [idProof,total]= await Promise.all([

        verificationRequestModel.find({status}).skip(skip).limit(limit),
        verificationRequestModel.countDocuments({status})
    ])
    return {idProof,total}
    }

    async findByIdProof(idProof_id:string[]):Promise<User[]>{
      return await userModel.find({idproof_id:{$in:idProof_id}}).populate('idproof_id')
    }
    async idProofUprove(idProof_id:string,owner_id:string):Promise<boolean>{
     const success =  await verificationRequestModel.findByIdAndUpdate(idProof_id,{status:'approved'})
     if(success){
      await userModel.findByIdAndUpdate(owner_id,{is_verified_user:true})
     }
     return !!success
    }
    async idProofReject(idProof_id:string,reason:string):Promise<boolean>{
     const success =  await verificationRequestModel.findByIdAndUpdate(idProof_id,{status:'rejected',reason})
     return !!success
    }

    async setVeifedUser(userId: string): Promise<boolean> {
      const success = await userModel.findByIdAndUpdate(userId,{is_verified_user:true})
      return !!success
 
    }
    async vendorAccess(userId: string, vendor_access: boolean): Promise<boolean> {
      const success = await userModel.findByIdAndUpdate(userId, { vendor_access:!vendor_access })
      return !!success
    }
}