import { CreateUserInputDto, CreateUserOutputDto } from "../../../domain/interface/DTOs/userDto/AuthDto";
import { IUserRepository } from "../../../domain/interface/repositoryInterface/IUserRepository";
import { IWalletRepository } from "../../../domain/interface/repositoryInterface/IWalletRepository";
import { IHashPassword } from "../../../domain/interface/serviceInterface/IHashPassword";
import { IcreateUserUsecase } from "../../../domain/interface/usecaseInterface/auth/register/userUsecaseInterface";

export class CreateUserUsecase implements IcreateUserUsecase{
    private userRepository :IUserRepository
    private hashPassword: IHashPassword
    private walletRepository: IWalletRepository
    constructor(_userRepository:IUserRepository, _hashPassword:IHashPassword, _walletRepository:IWalletRepository){
        this.hashPassword = _hashPassword
        this.userRepository = _userRepository
        this.walletRepository = _walletRepository
    }

    async createUser(payload: CreateUserInputDto): Promise<CreateUserOutputDto | null> {

        const existUser = await this.userRepository.findByEmail(payload.email)
        if(existUser)throw new Error('user already exist')
            const {password,email,name,phone} = payload

        let hashPassword = null
        if(password)hashPassword = await this.hashPassword.hashPassword(password)

        const newUser = await this.userRepository.create({
            name,
            phone,
            email,
            password:hashPassword ?? '',
            role: 'user',
            is_verified_user: false,
            last_login: new Date()
        })

if (!newUser) throw new Error('Error while creating user')

// Create wallet for the new user
if (newUser._id) {
    await this.walletRepository.create({user_id:newUser._id.toString(),balance:0,is_frozen:false,transactions:[]})
}

const returnUser: CreateUserOutputDto ={
    _id: newUser._id?.toString() || '',
    email: newUser.email,
    name: newUser.name,
    phone: newUser.phone,
    role: newUser.role,
    is_verified_user: newUser.is_verified_user,
    last_login: newUser.last_login,
    vendor_access: newUser.vendor_access,
    googleVerification: newUser.googleVerification
} 
     return returnUser
    }
}