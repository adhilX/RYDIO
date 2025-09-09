import { IUserRepository } from "../../../domain/interface/repositoryInterface/IUserRepository"
import { IOtpService } from "../../../domain/interface/serviceInterface/IOtpService"
import { IVerifyOtpUsecase } from "../../../domain/interface/usecaseInterface/auth/register/IVerifyOtpUsecase"

export class VerifyForgotPasswordOtpUsecase implements IVerifyOtpUsecase{
     private _otpService : IOtpService
     private _userRepository : IUserRepository
     constructor(otpService:IOtpService,userRepository:IUserRepository){
        this._otpService = otpService
        this._userRepository = userRepository
     }

       async verifyOtp(email: string, enteredOtp: string): Promise<boolean> {
           const valideEmail = await this._userRepository.findByEmail(email)
           if(!valideEmail)throw new Error('email is not valide')
          return  this._otpService.verifyOtp(email,enteredOtp)
       }
}