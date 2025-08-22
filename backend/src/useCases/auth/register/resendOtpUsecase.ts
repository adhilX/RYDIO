import { IemailServise } from "../../../domain/interface/serviceInterface/IemailService"
import { IotpService } from "../../../domain/interface/serviceInterface/IotpService"
import { IresendOtpUsecase } from "../../../domain/interface/usecaseInterface/auth/register/IresendOtpUsecase"

export class ResendOtpUsecase implements IresendOtpUsecase{

    private _otpService: IotpService
    private _emailService :IemailServise
    constructor(otpSevice:IotpService, emailService: IemailServise){
        this._otpService = otpSevice
        this._emailService = emailService
    }

   async resendOtp(email: string): Promise<void> {
       const otp =  this._otpService.genarateOtp()
       await this._otpService.storeOtp(email,otp)
       await this._emailService.sendOtp(email,otp)
   }
}