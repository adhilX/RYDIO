import { IsendOptUsecase } from "../../../domain/interface/usecaseInterface/user/authentication/IotpUsecase/IsendOtpUsecase"
import { IemailServise } from "../../../domain/interface/serviceInterface/IemailService"
import { IotpService } from "../../../domain/interface/serviceInterface/IotpService"
import { IuserRepository } from "../../../domain/interface/repositoryInterface/IuserRepository"
import { SendForgotPasswordOtpInputDto, SendForgotPasswordOtpOutputDto } from "../../../domain/interface/DTOs/userDto/AuthDto"

export class SendOtpUserUsecase implements IsendOptUsecase{
     private _otpService : IotpService
     private _emailService : IemailServise
     private _userRepository : IuserRepository
     constructor(otpService:IotpService,emailSevice:IemailServise,userRepository:IuserRepository){
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