    import { User } from "../../domain/entities/userEntities";
    import { IadminRepository } from "../../domain/interface/repositoryInterface/IadminRepository";
    import { IsearchUserUsecase } from "../../domain/interface/usecaseInterface/admin/IsearchUserUsecase";

    export class SearchUserusercase implements IsearchUserUsecase{
        private adminRepository: IadminRepository

        constructor(adminRepository:IadminRepository){
            this.adminRepository = adminRepository
        }

    async searchUser(search: string, page: number, limit: number): Promise<{ users: Pick<User,'name'|'email'|'phone'|'_id'>[]; total: number; } | null> {
         const result= await this.adminRepository.SearchUser(search,page,limit)
         if(!result) return null
        const {users,total}= result
         const fileredUser = users.map((user:User) => {
              const plainUser = JSON.parse(JSON.stringify(user))
            const { password, ...rest } = plainUser
            return rest;
          });
          return { users: fileredUser, total};
    }
    }