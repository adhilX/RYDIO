import { IuserRepository } from "../../../domain/interface/repositoryInterface/IuserRepository"
import { IotpService } from "../../../domain/interface/serviceInterface/IotpService"
import { IverfyOtpUsecase } from "../../../domain/interface/usecaseInterface/auth/register/IverfyOtpUsecase"

export class VerifyForgotPasswordOtpUsecase implements IverfyOtpUsecase{
     private _otpService : IotpService
     private _userRepository : IuserRepository
     constructor(otpService:IotpService,userRepository:IuserRepository){
        this._otpService = otpService
        this._userRepository = userRepository
     }

       async verifyOtp(email: string, enteredOtp: string): Promise<boolean> {
           const valideEmail = await this._userRepository.findByEmail(email)
           if(!valideEmail)throw new Error('email is not valide')
          return  this._otpService.verifyOtp(email,enteredOtp)
       }
}