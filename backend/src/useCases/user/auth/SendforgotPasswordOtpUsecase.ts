import { IuserRepository } from "../../../domain/interface/repositoryInterface/IuserRepository"
import { IemailServise } from "../../../domain/interface/serviceInterface/IemailService"
import { IotpService } from "../../../domain/interface/serviceInterface/IotpService"
import { IsendOptUsecase } from "../../../domain/interface/usecaseInterface/user/authentication/IotpUsecase/IsendOtpUsecase"

export class ForgotPasswordUsecase implements IsendOptUsecase{
     private otpService : IotpService
     private emailService : IemailServise
     private userRepository : IuserRepository
     constructor(otpService:IotpService,emailSevice:IemailServise,userRepository:IuserRepository){
        this.otpService = otpService
        this.emailService = emailSevice
        this.userRepository = userRepository
     }

     async execute(email: string): Promise<void> {
        const existingUser = await this.userRepository.findByEmail(email)
        if(!existingUser)throw new Error('user not found with this email')
        const otp = this.otpService.genarateOtp()
         console.log(otp)
        await this.otpService.storeOtp(email,otp)
        await this.emailService.sendOtp(email,otp)
     }
}