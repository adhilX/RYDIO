import { SendForgotPasswordOtpInputDto, SendForgotPasswordOtpOutputDto } from "../../../domain/interface/DTOs/userDto/AuthDto";
import { IUserRepository } from "../../../domain/interface/repositoryInterface/IUserRepository"
import { IemailServise } from "../../../domain/interface/serviceInterface/IemailService"
import { IotpService } from "../../../domain/interface/serviceInterface/IotpService"
import { IsendOptUsecase } from "../../../domain/interface/usecaseInterface/auth/register/IsendOtpUsecase"

export class ForgotPasswordUsecase implements IsendOptUsecase{
     private _otpService : IotpService
     private _emailService : IemailServise
     private _userRepository : IUserRepository
     constructor(otpService:IotpService,emailSevice:IemailServise,userRepository:IUserRepository){
        this._otpService = otpService
        this._emailService = emailSevice
        this._userRepository = userRepository
     }

     async execute(input: SendForgotPasswordOtpInputDto): Promise<SendForgotPasswordOtpOutputDto> {
        const { email } = input;
        console.log(email)
        const existingUser = await this._userRepository.findByEmail(email)
        if(!existingUser)throw new Error('user not found with this email')
        const otp = this._otpService.genarateOtp()
         console.log(otp)
        await this._otpService.storeOtp(email,otp)
        await this._emailService.sendOtp(email,otp)
        
        return {
            success: true,
            message: 'OTP sent successfully to your email'
        };
     }
}