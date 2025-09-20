import { Request, Response } from "express";
import { HttpStatus } from "../../../../domain/entities/httpStatus"
import { IResendOtpUsecase } from "../../../../domain/interface/usecaseInterface/auth/register/IResendOtpUsecase";

export class ResendOtpController{
    private _ResendOtpUsecase:IResendOtpUsecase

    constructor(ResendOtpUsecase:IResendOtpUsecase){
        this._ResendOtpUsecase = ResendOtpUsecase
    }

    async resendOpt(req: Request, res: Response): Promise<void>{
        try {
            const { user } = req.body
            await this._ResendOtpUsecase.resendOtp(user?.email)
            res.status(HttpStatus.OK).json({ message: 'OTP sent successfully' })
            return
        } catch (error) {
            console.error('error while sending otp', error)
            res.status(HttpStatus.BAD_REQUEST).json({ message: "error while sending otp test", error: error instanceof Error ? error.message : 'error while sending otp' })
        }
    }
}