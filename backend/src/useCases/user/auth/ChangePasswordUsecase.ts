import { User } from "../../../domain/entities/userEntities"
import { IuserRepository } from "../../../domain/interface/repositoryInterface/IuserRepository"
import { IhashPassword } from "../../../domain/interface/serviceInterface/IhashPassword"
import { IchangePasswordUsecase } from "../../../domain/interface/usecaseInterface/user/authentication/IchangePasswordUsecase"

export class ChangePasswordUseCase implements IchangePasswordUsecase {
    private userRepository:IuserRepository 
    private hashPassword: IhashPassword 
    constructor(userRepository: IuserRepository,hashPassword:IhashPassword) {
        this.userRepository = userRepository
        this.hashPassword = hashPassword
   
    }
    async ChangePassword(email: string, newPassword: string): Promise<User> {
        const user = await this.userRepository.findByEmail(email)
        if (!user) throw new Error('No client exist in this email')
        const hashedPassword = await this.hashPassword.hashPassword(newPassword)
        if (!hashedPassword) throw new Error('Error while hashing password')
        const updatedUser = await this.userRepository.forgotPassword(email, hashedPassword)
        if (!updatedUser) throw new Error('error while updating new password in client')
        return updatedUser
    }
}