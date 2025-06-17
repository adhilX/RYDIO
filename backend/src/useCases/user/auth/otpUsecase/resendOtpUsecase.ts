import { IemailServise } from "../../../../domain/interface/serviceInterface/IemailService"
import { IotpService } from "../../../../domain/interface/serviceInterface/IotpService"
import { IresendOtpUsecase } from "../../../../domain/interface/usecaseInterface/user/authentication/IotpUsecase/IresendOtpUsecase"

export class ResendOtpUsecase implements IresendOtpUsecase{

    private otpService: IotpService
    private emailService :IemailServise
    constructor(otpSevice:IotpService, emailService: IemailServise){
        this.otpService = otpSevice
        this.emailService = emailService
    }

   async resendOtp(email: string): Promise<void> {
       const otp =  this.otpService.genarateOtp()
       await this.otpService.storeOtp(email,otp)
       await this.emailService.sendOtp(email,otp)
   }
}