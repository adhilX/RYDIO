import { Request, Response } from "express";
import { HttpStatus } from "../../../../domain/entities/httpStatus";
import { ISendOtpUsecase } from "../../../../domain/interface/usecaseInterface/auth/register/IsendOtpUsecase";
export class SendOtpController{
    private _userSendOtpUsecase:ISendOtpUsecase

    constructor(userSendOtpUsecase:ISendOtpUsecase){
        this._userSendOtpUsecase = userSendOtpUsecase
    }

    async sendOtp(req: Request, res:Response):Promise<void>{
        try {
            const {user} = req.body
            console.log(user,'ggg')
            await this._userSendOtpUsecase.execute({email:user?.email})
            res.status(HttpStatus.OK).json({message:'OTP sended successfully'})
            return
        } catch (error) {
            console.error('error while sending otp',error)
            res.status(HttpStatus.BAD_REQUEST).json({message:"error while sending otp test",error:error instanceof Error ? error.message: 'error while sending otp'})
        }
    }
}