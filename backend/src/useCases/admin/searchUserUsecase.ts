    import { User } from "../../domain/entities/userEntities";
import { IAdminRepository } from "../../domain/interface/repositoryInterface/IAdminRepository";
import { ISearchUserUsecase } from "../../domain/interface/usecaseInterface/admin/ISearchUserUsecase";
import { SearchUserInputDto, SearchUserOutputDto, BaseUserOutputDto } from "../../domain/interface/DTOs/adminDto/AdminDto";

export class SearchUserusercase implements ISearchUserUsecase{
    private _adminRepository: IAdminRepository

    constructor(adminRepository:IAdminRepository){
        this._adminRepository = adminRepository
    }

    async searchUser(input: SearchUserInputDto): Promise<SearchUserOutputDto | null> {
         const result = await this._adminRepository.SearchUser(input.search, input.page, input.limit, input.filters)
         if(!result) return null
        const {users, total} = result
         const mappedUsers: BaseUserOutputDto[] = users.map((user: User) => {
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
          return { users: mappedUsers, total};
    }
}