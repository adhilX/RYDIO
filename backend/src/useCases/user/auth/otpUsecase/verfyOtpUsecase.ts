import { IotpService } from "../../../../domain/interface/serviceInterface/IotpService";
import { IverfyOtpUsecase } from "../../../../domain/interface/usecaseInterface/user/authentication/IotpUsecase/IverfyOtpUsecase";

export class VerifyOtpUsecase implements IverfyOtpUsecase{

    private otpService: IotpService

    constructor(otpSevice:IotpService){
        this.otpService = otpSevice
    }

    async verifyOtp(email: string, enteredOtp: string): Promise<boolean> {
        return this.otpService.verifyOtp(email,enteredOtp)
    }
}