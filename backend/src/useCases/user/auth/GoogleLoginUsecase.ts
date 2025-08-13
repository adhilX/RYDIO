import { User } from "../../../domain/entities/userEntities";
import { IuserRepository } from "../../../domain/interface/repositoryInterface/IuserRepository";
import { IWalletRepository } from "../../../domain/interface/repositoryInterface/IwalletRepository";
import { IgoogleloginUsecase } from "../../../domain/interface/usecaseInterface/user/authentication/IgoogleLoginUsecase";

export class GoogleLoginUsecase implements IgoogleloginUsecase {

    private _userRepository: IuserRepository
    private _walletRepository: IWalletRepository

    constructor(userRepository: IuserRepository,walletRepository: IWalletRepository) {
        this._userRepository = userRepository
        this._walletRepository = walletRepository
    }
    async googleLogin(user: User): Promise<Omit<User, 'password'>> {
        const existingWallet = await this._walletRepository.getWalletByUserId(user._id?.toString()!);
        if (!existingWallet) {
            await this._walletRepository.create({user_id:user._id?.toString()!,balance:0,is_frozen:false,transactions:[]})
        }
        const existingUser = await this._userRepository.findByEmail(user.email)
        if (existingUser) {
            if (existingUser.is_blocked) throw new Error('user is blocked')
            return existingUser
        }
        else {
            const createUser = await this._userRepository.googleLogin(user)
            if (!createUser) throw new Error('error while creating new user using google login')
                const { password: _, ...userWithoutPassword } = createUser as User;
            // Create a wallet for the new user
            return userWithoutPassword
        }
    }
}