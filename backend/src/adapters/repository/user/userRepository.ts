import { User } from "../../../domain/entities/userEntities";
import { IUserRepository } from "../../../domain/interface/repositoryInterface/IUserRepository";
import { userModel } from "../../../framework/database/models/userModel";
import { BaseRepository } from "../base/BaseRepo";

export class UserRepository extends BaseRepository<User> implements IUserRepository{
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

      // Dashboard Analytics Methods
      async getTotalUsersCount(): Promise<number> {
          return await userModel.countDocuments({ role: 'user' });
      }

      async getActiveUsersCount(): Promise<number> {
          return await userModel.countDocuments({ role: 'user', is_blocked: false });
      }

      async getBlockedUsersCount(): Promise<number> {
          return await userModel.countDocuments({ role: 'user', is_blocked: true });
      }

      async getUserActivityChartData(): Promise<Array<{ height: number; color: string }>> {
          const [totalUsers, activeUsers, blockedUsers] = await Promise.all([
              this.getTotalUsersCount(),
              this.getActiveUsersCount(),
              this.getBlockedUsersCount()
          ]);
          
          // Calculate percentages for chart heights (0-100)
          const activePercentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
          const blockedPercentage = totalUsers > 0 ? Math.round((blockedUsers / totalUsers) * 100) : 0;
          
          return [
              { height: activePercentage, color: '#10B981' }, // Green for active users
              { height: blockedPercentage, color: '#EF4444' }  // Red for blocked users
          ];
      }

      async getPendingVendorAccessRequests(): Promise<number> {
          return await userModel.countDocuments({ 
              role: 'user', 
              vendor_access_requested: true,
              vendor_access: false 
          });
      }

      async getPendingVerificationRequests(): Promise<number> {
          return await userModel.countDocuments({ 
              role: 'user', 
              verification_status: 'pending' 
          });
      }

      async getVerifiedUsersCount(): Promise<number> {
          return await userModel.countDocuments({ 
              role: 'user', 
              verification_status: 'verified' 
          });
      }
    }