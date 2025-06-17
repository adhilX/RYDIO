import { Request, Response } from "express";
import { HttpStatus } from "../../../../domain/entities/httpStatus"
import { IresendOtpUsecase } from "../../../../domain/interface/usecaseInterface/user/authentication/IotpUsecase/IresendOtpUsecase"

export class ResendOtpController{
    private ResendOtpUsecase:IresendOtpUsecase

    constructor(ResendOtpUsecase:IresendOtpUsecase){
        this.ResendOtpUsecase = ResendOtpUsecase
    }

    async resendOpt(req: Request, res: Response): Promise<void>{
        try {
            const { user } = req.body
            console.log(user, 'ggg')
            await this.ResendOtpUsecase.resendOtp(user?.email)
            res.status(Number(HttpStatus.OK)).json({ message: 'OTP sent successfully' })
            return
        } catch (error) {
            console.error('error while sending otp', error)
            res.status(Number(HttpStatus.BAD_REQUEST)).json({ message: "error while sending otp test", error: error instanceof Error ? error.message : 'error while sending otp' })
        }
    }
}