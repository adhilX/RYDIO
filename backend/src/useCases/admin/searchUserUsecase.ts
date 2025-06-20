    import { User } from "../../domain/entities/userEntities";
    import { IadminRepository } from "../../domain/interface/repositoryInterface/IadminRepository";
    import { IsearchUserUsecase } from "../../domain/interface/usecaseInterface/admin/IsearchUserUsecase";

    export class SearchUserusercase implements IsearchUserUsecase{
        private adminRepository: IadminRepository

        constructor(adminRepository:IadminRepository){
            this.adminRepository = adminRepository
        }

    async searchUser(search: string, page: number, limit: number): Promise<{ users: User[]; total: number; } | null> {
        return this.adminRepository.SearchUser(search,page,limit)
    }
    }