import { IWallet } from "../../../domain/entities/walletEnties";
import { LoginUserInputDto, LoginUserOutputDto } from "../../../domain/interface/DTOs/userDto/AuthDto";
import { IuserRepository } from "../../../domain/interface/repositoryInterface/IuserRepository";
import { IWalletRepository } from "../../../domain/interface/repositoryInterface/IwalletRepository";
import { IhashPassword } from "../../../domain/interface/serviceInterface/IhashPassword";
import { IloginUserUsecase } from "../../../domain/interface/usecaseInterface/user/authentication/IloginUserUsecase";

export class LoginUserUsecase implements IloginUserUsecase{

    private _userRepository : IuserRepository
    private _hashPassword: IhashPassword
    private _walletRepository: IWalletRepository

    constructor(userRepository:IuserRepository, hashPassword:IhashPassword,walletRepository:IWalletRepository){
        this._hashPassword = hashPassword
        this._userRepository = userRepository
        this._walletRepository = walletRepository
    }

   async loginUser({email, password}: LoginUserInputDto):Promise<LoginUserOutputDto>{
        const user = await this._userRepository.findByEmail(email)
        if(!user)throw new Error('user not exist with this Email')
            console.log(user.is_blocked)
            if(user.is_blocked)throw new Error('user is blocked')
                const matchPass = await this._hashPassword.comparePassword(password,user.password)
            if(!matchPass)throw new Error('passaword not match')
                // Create a wallet if it doesn't exist
                if (!user._id) throw new Error('User ID is missing');
                const userId = user._id.toString();
                const existingWallet: IWallet | null = await this._walletRepository.getWalletByUserId(userId);
                if (!existingWallet) {
                    await this._walletRepository.create({ 
                        user_id: userId,
                        balance: 0,
                        is_frozen: false,
                        transactions: []
                    });
                }
                user.idproof_id

                return {
                     _id: user._id?.toString(),
                     email: user.email,
                     name: user.name,
                     phone: user.phone,
                     idproof_id: user.idproof_id,
                     profile_image: user?.profile_image,
                     role: user.role,
                     is_blocked: user.is_blocked,
                     is_verified_user: user.is_verified_user,
                     last_login: user.last_login,
                     vendor_access: user.vendor_access,
                     googleVerification: user.googleVerification
                }
    }
}