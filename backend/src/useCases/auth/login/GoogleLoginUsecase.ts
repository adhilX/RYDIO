import { GoogleLoginInputDto, GoogleLoginOutputDto } from "../../../domain/interface/DTOs/userDto/AuthDto";
import { User } from "../../../domain/entities/userEntities";
import { IuserRepository } from "../../../domain/interface/repositoryInterface/IuserRepository";
import { IWalletRepository } from "../../../domain/interface/repositoryInterface/IwalletRepository";
import { IgoogleloginUsecase } from "../../../domain/interface/usecaseInterface/auth/login/IgoogleLoginUsecase";

export class GoogleLoginUsecase implements IgoogleloginUsecase {

    private _userRepository: IuserRepository
    private _walletRepository: IWalletRepository

    constructor(userRepository: IuserRepository,walletRepository: IWalletRepository) {
        this._userRepository = userRepository
        this._walletRepository = walletRepository
    }
    async googleLogin(input: GoogleLoginInputDto): Promise<GoogleLoginOutputDto> {
        const { email, name, profile_image, googleVerification } = input;
        
        const user: Partial<User> = {
            email,
            name,
            profile_image,
            googleVerification,
            role: 'user',
            is_verified_user: false,
            last_login: new Date()
        };
        
        const existingUser = await this._userRepository.findByEmail(email)
        if (existingUser) {
            if (existingUser.is_blocked) throw new Error('user is blocked')
            
            // Create wallet if doesn't exist
            if (existingUser._id) {
                const existingWallet = await this._walletRepository.getWalletByUserId(existingUser._id.toString());
                if (!existingWallet) {
                    await this._walletRepository.create({user_id:existingUser._id.toString(),balance:0,is_frozen:false,transactions:[]})
                }
            }
            
            return {
                _id: existingUser._id?.toString(),
                email: existingUser.email,
                name: existingUser.name,
                phone: existingUser.phone,
                idproof_id: typeof existingUser.idproof_id === 'string' ? existingUser.idproof_id : existingUser.idproof_id?.toString(),
                profile_image: existingUser.profile_image,
                role: existingUser.role,
                is_blocked: existingUser.is_blocked,
                is_verified_user: existingUser.is_verified_user,
                last_login: existingUser.last_login,
                vendor_access: existingUser.vendor_access,
                googleVerification: existingUser.googleVerification
            };
        }
        else {
            const createUser = await this._userRepository.googleLogin(user as User)
            if (!createUser) throw new Error('error while creating new user using google login')
            
            // Create a wallet for the new user
            if (createUser._id) {
                await this._walletRepository.create({user_id:createUser._id.toString(),balance:0,is_frozen:false,transactions:[]})
            }
            
            return {
                _id: createUser._id?.toString(),
                email: createUser.email,
                name: createUser.name,
                phone: createUser.phone,
                idproof_id: typeof createUser.idproof_id === 'string' ? createUser.idproof_id : createUser.idproof_id?.toString(),
                profile_image: createUser.profile_image,
                role: createUser.role,
                is_blocked: createUser.is_blocked,
                is_verified_user: createUser.is_verified_user,
                last_login: createUser.last_login,
                vendor_access: createUser.vendor_access,
                googleVerification: createUser.googleVerification
            };
        }
    }
}