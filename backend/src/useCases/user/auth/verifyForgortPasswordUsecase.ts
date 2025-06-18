import { IuserRepository } from "../../../domain/interface/repositoryInterface/IuserRepository"
import { IemailServise } from "../../../domain/interface/serviceInterface/IemailService"
import { IotpService } from "../../../domain/interface/serviceInterface/IotpService"
import { IsendOptUsecase } from "../../../domain/interface/usecaseInterface/user/authentication/IotpUsecase/IsendOtpUsecase"
import { IverfyOtpUsecase } from "../../../domain/interface/usecaseInterface/user/authentication/IotpUsecase/IverfyOtpUsecase"

export class VerifyForgotPasswordOtpUsecase implements IverfyOtpUsecase{
     private otpService : IotpService
     private userRepository : IuserRepository
     constructor(otpService:IotpService,userRepository:IuserRepository){
        this.otpService = otpService
        this.userRepository = userRepository
     }

       async verifyOtp(email: string, enteredOtp: string): Promise<boolean> {
           const valideEmail = await this.userRepository.findByEmail(email)
           if(!valideEmail)throw new Error('email is not valide')
          return  this.otpService.verifyOtp(email,enteredOtp)
       }
}