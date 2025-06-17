import { User } from "../../domain/entities/userEntities";
import { IadminRepository } from "../../domain/interface/repositoryInterface/IadminRepository";
import { IhashPassword } from "../../domain/interface/serviceInterface/IhashPassword";
import { IadminLoginUseCase } from "../../domain/interface/usecaseInterface/admin/Auth/adminLoginUsecase";

export class LoginAdminUsecase implements IadminLoginUseCase{

    private adminRepository : IadminRepository
    private hashPassword: IhashPassword

    constructor(adminRepository:IadminRepository, hashPassword:IhashPassword){
        this.hashPassword = hashPassword
        this.adminRepository = adminRepository
    }

   async handleLogin(email: string, password: string):Promise<User>{
        const admin = await this.adminRepository.findByEmail(email)
        if(!admin)throw new Error('user not exist with this Email')
            if(admin.role !== 'admin') throw new Error('this is not admin')
                const matchPass = await this.hashPassword.comparePassword(password,admin.password)
            if(!matchPass)throw new Error('passaword not match')
                return admin
    }

}