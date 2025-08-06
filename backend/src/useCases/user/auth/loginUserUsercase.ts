import { User } from "../../../domain/entities/userEntities";
import { IWallet } from "../../../domain/entities/walletEnties";
import { IuserRepository } from "../../../domain/interface/repositoryInterface/IuserRepository";
import { IWalletRepository } from "../../../domain/interface/repositoryInterface/IwalletRepository";
import { IhashPassword } from "../../../domain/interface/serviceInterface/IhashPassword";
import { IloginUserUsecase } from "../../../domain/interface/usecaseInterface/user/authentication/IloginUserUsecase";

export class LoginUserUsecase implements IloginUserUsecase{

    private userRepository : IuserRepository
    private hashPassword: IhashPassword
    private walletRepository: IWalletRepository

    constructor(userRepository:IuserRepository, hashPassword:IhashPassword,walletRepository:IWalletRepository){
        this.hashPassword = hashPassword
        this.userRepository = userRepository
        this.walletRepository = walletRepository
    }

   async loginUser(email: string, password: string):Promise<Omit<User, 'password'>>{
        const user = await this.userRepository.findByEmail(email)
        if(!user)throw new Error('user not exist with this Email')
            console.log(user.is_blocked)
            if(user.is_blocked)throw new Error('user is blocked')
                const matchPass = await this.hashPassword.comparePassword(password,user.password)
            if(!matchPass)throw new Error('passaword not match')
                // Create a wallet if it doesn't exist
                const existingWallet: IWallet | null = await this.walletRepository.getWalletByUserId(user._id?.toString()!);
                if (!existingWallet) {
                    await this.walletRepository.createWallet(user?._id?.toString()!)
                }
                const plainUser = JSON.parse(JSON.stringify(user))
                const {password:_,...userWithoutPassword} = plainUser
            console.log(userWithoutPassword)
                return userWithoutPassword
    }
}