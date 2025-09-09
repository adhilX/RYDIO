import { User } from "../../domain/entities/userEntities";
import { IAdminRepository } from "../../domain/interface/repositoryInterface/IAdminRepository";
import { IgetAllUserUsecase } from "../../domain/interface/usecaseInterface/admin/getAllUserUsecase";
import { GetAllUsersOutputDto, BaseUserOutputDto } from "../../domain/interface/DTOs/adminDto/AdminDto";

export class GetAllUserUsecase implements IgetAllUserUsecase{
    private _adminRepository: IAdminRepository

    constructor(adminRepository:IAdminRepository){
        this._adminRepository = adminRepository
    }

  async getAllUser(): Promise<GetAllUsersOutputDto | null> {
    const result = await this._adminRepository.getAllUsers()
    if (!result) return null
    
    const mappedUsers: BaseUserOutputDto[] = result.map((user: User) => {
      const plainUser = JSON.parse(JSON.stringify(user))
      const rest = plainUser
      return {
        _id: rest._id,
        email: rest.email,
        name: rest.name,
        phone: rest.phone,
        role: rest.role,
        is_blocked: rest.is_blocked,
        is_verified_user: rest.is_verified_user,
        last_login: rest.last_login,
        vendor_access: rest.vendor_access,
        googleVerification: rest.googleVerification,
        profile_image: rest.profile_image,
        createdAt: rest.createdAt,
        updatedAt: rest.updatedAt
      };
    });
    
    return {
      users: mappedUsers,
      total: mappedUsers.length
    };
  }
}