import { ISendOtpUsecase } from "../../../domain/interface/usecaseInterface/auth/register/IsendOtpUsecase"
import { IEmailService } from "../../../domain/interface/serviceInterface/IemailService"
import { IOtpService } from "../../../domain/interface/serviceInterface/IOtpService"
import { IUserRepository } from "../../../domain/interface/repositoryInterface/IUserRepository"
import { SendForgotPasswordOtpInputDto, SendForgotPasswordOtpOutputDto } from "../../../domain/interface/DTOs/userDto/AuthDto"

export class SendOtpUserUsecase implements ISendOtpUsecase{
     private _otpService : IOtpService
     private _emailService : IEmailService
     private _userRepository : IUserRepository
     constructor(otpService:IOtpService,emailSevice:IEmailService,userRepository:IUserRepository){
        this._otpService = otpService
        this._emailService = emailSevice
        this._userRepository = userRepository
     }

     async execute(input: SendForgotPasswordOtpInputDto): Promise<SendForgotPasswordOtpOutputDto> {
        const { email } = input;
        const existingUser = await this._userRepository.findByEmail(email)
        if(existingUser)throw new Error('user already exist')
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