import { IOtpService } from "../../../domain/interface/serviceInterface/IOtpService"
import { IVerifyOtpUsecase } from "../../../domain/interface/usecaseInterface/auth/register/IVerifyOtpUsecase"

export class VerifyOtpUsecase implements IVerifyOtpUsecase{

    private _otpService: IOtpService

    constructor(otpSevice:IOtpService){
        this._otpService = otpSevice
    }

    async verifyOtp(email: string, enteredOtp: string): Promise<boolean> {
        return this._otpService.verifyOtp(email,enteredOtp)
    }
}