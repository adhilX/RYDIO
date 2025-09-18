import { IVerificationRequest } from "../../../domain/entities/VerificationRequest";
import { User } from "../../../domain/entities/userEntities";
import { IVehicle } from "../../../domain/entities/vehcleEnties";
import { IAdminRepository } from "../../../domain/interface/repositoryInterface/IAdminRepository";
import { userModel } from "../../../framework/database/models/userModel";
import { VehicleModel } from "../../../framework/database/models/vehicleModel";
import { verificationRequestModel } from "../../../framework/database/models/verificationRequestModel";
import { BaseRepository } from "../base/BaseRepo";

export class AdminRepository extends BaseRepository<User> implements IAdminRepository {
  constructor() {
    super(userModel);
  }
  async getAllUsers(): Promise<User[] | null> {
    return userModel.find()
  }

  async SearchUser(search = "", page = 1, limit = 10, filters?: { status: string; vendorAccess: string }): Promise<{ users: User[]; total: number } | null> {
    const  query: any = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    query.role = 'user'
    // Status filter
    if (filters?.status && filters.status !== 'all') {
      if (filters.status === 'active') {
        query.is_blocked = false;
      } else if (filters.status === 'blocked') {
        query.is_blocked = true;
      }
    }
    
    // Vendor access filter
    if (filters?.vendorAccess && filters.vendorAccess !== 'all') {
      query.vendor_access = filters.vendorAccess === 'true';
    }
    
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

  async getPendingVehicle(page = 1, limit = 10, _search: string): Promise<{ vehicles: IVehicle[]; total: number } | null> {
  const skip = (page - 1) * limit;
  const  filter = { admin_approve: { $ne: 'accepted' } };
  
  const [vehicles, total] = await Promise.all([
    VehicleModel.find(filter).populate('owner_id').populate('location_id').skip(skip).limit(limit),
    VehicleModel.countDocuments(filter)
  ]);
  return { vehicles, total };
}
  async getApprovedVehicle(search='',page = 1, limit = 10, filters?: { category: string; fuelType: string; transmission: string }): Promise<{ vehicles: IVehicle[]; total: number,totalCount:number } | null> {
  const skip = (page - 1) * limit;
  console.log(search)
  
  const query: any = { admin_approve: 'accepted' };
  
  // Search filter
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } }
    ];
  }
  
  // Category filter
  if (filters?.category && filters.category !== 'all') {
    query.category = { $regex: filters.category, $options: 'i' };
  }
  
  // Fuel type filter
  if (filters?.fuelType && filters.fuelType !== 'all') {
    query.fuel_type = { $regex: filters.fuelType, $options: 'i' };
  }
  
  // Transmission filter
  if (filters?.transmission && filters.transmission !== 'all') {
    query.transmission = { $regex: filters.transmission, $options: 'i' };
  }
  
  const [vehicles, total, totalCount] = await Promise.all([
    VehicleModel.find(query).populate('owner_id').populate('location_id').skip(skip).limit(limit),
    VehicleModel.countDocuments(query),
    VehicleModel.countDocuments()
  ]);
  return { vehicles, total, totalCount };
}

 async getIdProof(status: "pending" | "approved" | "rejected", page: number, limit: number): Promise<{idProof:IVerificationRequest[]; total:number }| null> {

    const skip = (page - 1) * limit;
    const [idProofDocs,total]= await Promise.all([

        verificationRequestModel.find({status}).skip(skip).limit(limit),
        verificationRequestModel.countDocuments({status})
    ])
    
    const idProof: IVerificationRequest[] = idProofDocs.map(doc => ({
        _id: doc._id.toString(),
        idProofUrl: doc.idProofUrl,
        status: doc.status,
        reason: doc.reason,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
    }));
    
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