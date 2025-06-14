import { Request, Response } from "express";
import { IsendOptUsecase } from "../../../../domain/interface/usecaseInterface/user/authentication/IotpUsecase/IsendOtpUsecase";
import { HttpStatus } from "../../../../domain/entities/httpStatus";
export class SendOtpController{
    private userSendOtpUsecase:IsendOptUsecase

    constructor(userSendOtpUsecase:IsendOptUsecase){
        this.userSendOtpUsecase = userSendOtpUsecase
    }

    async sendOtp(req: Request, res:Response):Promise<void>{
        try {
            const {email} = req.body
            console.log(email,'ggg')
            await this.userSendOtpUsecase.execute(email)
            res.status(HttpStatus.OK).json({message:'OTP sended successfully'})
            return
        } catch (error) {
            console.error('error while sending otp',error)
            res.status(HttpStatus.BAD_REQUEST).json({message:"error while sending otp test",error:error instanceof Error ? error.message: 'error while sending otp'})
        }
    }
}