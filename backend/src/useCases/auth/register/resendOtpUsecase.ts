import { IEmailService } from "../../../domain/interface/serviceInterface/IemailService"
import { IOtpService } from "../../../domain/interface/serviceInterface/IOtpService"
import { IResendOtpUsecase } from "../../../domain/interface/usecaseInterface/auth/register/IResendOtpUsecase"

export class ResendOtpUsecase implements IResendOtpUsecase{

    private _otpService: IOtpService
    private _emailService :IEmailService
    constructor(otpSevice:IOtpService, emailService: IEmailService){
        this._otpService = otpSevice
        this._emailService = emailService
    }

   async resendOtp(email: string): Promise<void> {
       const otp =  this._otpService.genarateOtp()
       await this._otpService.storeOtp(email,otp)
       await this._emailService.sendOtp(email,otp)
   }
}