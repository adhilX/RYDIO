import { User } from "../../../domain/entities/userEntities";
import { IuserRepository } from "../../../domain/interface/repositoryInterface/IuserRepository";
import { IgoogleloginUsecase } from "../../../domain/interface/usecaseInterface/user/authentication/IgoogleLoginUsecase";

export class GoogleLoginUsecase implements IgoogleloginUsecase {

    private userRepository: IuserRepository

    constructor(userRepository: IuserRepository) {
        this.userRepository = userRepository
    }
    async googleLogin(user: User): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(user.email)
        if (existingUser) {
            if (existingUser.is_blocked) throw new Error('user is blocked')
            return existingUser
        }
        else {
            const createUser = await this.userRepository.googleLogin(user)
            if (!createUser) throw new Error('error while creating new user using google login')
            return createUser
        }
    }
}