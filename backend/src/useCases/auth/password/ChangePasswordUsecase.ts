import { ChangePasswordInputDto, ChangePasswordOutputDto } from "../../../domain/interface/DTOs/userDto/AuthDto";
import { IUserRepository } from "../../../domain/interface/repositoryInterface/IUserRepository"
import { IHashPassword } from "../../../domain/interface/serviceInterface/IHashPassword"
import { IchangePasswordUsecase } from "../../../domain/interface/usecaseInterface/auth/password/IchangePasswordUsecase"

export class ChangePasswordUseCase implements IchangePasswordUsecase {
    private _userRepository: IUserRepository
    private hashPassword: IHashPassword
    constructor(userRepository: IUserRepository, hashPassword: IHashPassword) {
        this._userRepository = userRepository
        this.hashPassword = hashPassword
    }
    async ChangePassword(input: ChangePasswordInputDto): Promise<ChangePasswordOutputDto> {
        const { email, newPassword } = input;
        const user = await this._userRepository.findByEmail(email)
        if (!user) throw new Error('No client exist in this email')
        const hashedPassword = await this.hashPassword.hashPassword(newPassword)
        if (!hashedPassword) throw new Error('Error while hashing password')
        const updatedUser = await this._userRepository.changePassword(user._id?.toString(), hashedPassword)
        if (!updatedUser) throw new Error('error while updating new password in client')
        
        return {
            _id: updatedUser._id?.toString(),
            email: updatedUser.email,
            name: updatedUser.name,
            phone: updatedUser.phone,
            idproof_id: updatedUser.idproof_id,
            profile_image: updatedUser.profile_image,
            role: updatedUser.role,
            is_blocked: updatedUser.is_blocked,
            is_verified_user: updatedUser.is_verified_user,
            last_login: updatedUser.last_login,
            vendor_access: updatedUser.vendor_access,
            googleVerification: updatedUser.googleVerification
        };
    }
}