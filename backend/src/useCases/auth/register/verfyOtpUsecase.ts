import { IotpService } from "../../../domain/interface/serviceInterface/IotpService"
import { IverfyOtpUsecase } from "../../../domain/interface/usecaseInterface/user/authentication/IotpUsecase/IverfyOtpUsecase"

export class VerifyOtpUsecase implements IverfyOtpUsecase{

    private _otpService: IotpService

    constructor(otpSevice:IotpService){
        this._otpService = otpSevice
    }

    async verifyOtp(email: string, enteredOtp: string): Promise<boolean> {
        return this._otpService.verifyOtp(email,enteredOtp)
    }
}