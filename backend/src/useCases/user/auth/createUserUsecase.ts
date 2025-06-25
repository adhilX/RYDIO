import { User } from "../../../domain/entities/userEntities";
import { IuserRepository } from "../../../domain/interface/repositoryInterface/IuserRepository";
import { IhashPassword } from "../../../domain/interface/serviceInterface/IhashPassword";
import { IcreateUserUsecase } from "../../../domain/interface/usecaseInterface/user/authentication/userUsecaseInterface";

export class CreateUserUsecase implements IcreateUserUsecase{
    private userRepository :IuserRepository
    private hashPassword: IhashPassword   
    constructor(userRepository:IuserRepository, hashPassword:IhashPassword){
        this.hashPassword = hashPassword
        this.userRepository = userRepository
    }

    async createUser(user: User): Promise<User | null> {
        
        const existUser = await this.userRepository.findByEmail(user.email)
        if(existUser)throw new Error('user already exist')
            const {password,email,name,phone} = user as User

        let hashPassword = null
        if(password)hashPassword = await this.hashPassword.hashPassword(password)

        const newUser = await this.userRepository.createUser({
            name,
            phone,
            email,
            password:hashPassword ?? '',
            role: 'user',
            is_verified_user: false,
            last_login: new Date()
        })
     if (!newUser) throw new Error('Error while creating user')
        return newUser
    }
}