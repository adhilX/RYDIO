import { User } from "../../../domain/entities/userEntities";
import { IuserRepository } from "../../../domain/interface/repositoryInterface/IuserRepository";
import { IhashPassword } from "../../../domain/interface/serviceInterface/IhashPassword";
import { IloginUserUsecase } from "../../../domain/interface/usecaseInterface/user/authentication/IloginUserUsecase";

export class LoginUserUsecase implements IloginUserUsecase{

    private userRepository : IuserRepository
    private hashPassword: IhashPassword

    constructor(userRepository:IuserRepository, hashPassword:IhashPassword){
        this.hashPassword = hashPassword
        this.userRepository = userRepository
    }

   async loginUser(email: string, password: string):Promise<Omit<User, 'password'>>{
        const user = await this.userRepository.findByEmail(email)
        if(!user)throw new Error('user not exist with this Email')
            console.log(user.is_blocked)
            if(user.is_blocked)throw new Error('user is blocked')
                const matchPass = await this.hashPassword.comparePassword(password,user.password)
            if(!matchPass)throw new Error('passaword not match')
                const plainUser = JSON.parse(JSON.stringify(user))
                const {password:_,...userWithoutPassword} = plainUser
            console.log(userWithoutPassword)
                return userWithoutPassword
    }
}