import { IVerifyOtpUsecase } from "../../../../domain/interface/usecaseInterface/auth/register/IVerifyOtpUsecase";
import { Request, Response } from "express";
import { HttpStatus } from "../../../../domain/entities/httpStatus";

export class VerifyForgotPassowordOtpController {
    private _verifyOtpUsecase : IVerifyOtpUsecase


    constructor(verifyOtpUsecase:IVerifyOtpUsecase){
        this._verifyOtpUsecase = verifyOtpUsecase
    }
     async verify(req: Request, res: Response): Promise<void> {

        const { email, otp } = req.body as { email: string; otp: string };
        try {
            const verify = await this._verifyOtpUsecase.verifyOtp(email, otp);
            if (verify) {
                res.status(HttpStatus.OK).json({ message: 'OTP verified successfully', data: verify });
            } else {
                res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid or expired OTP' });
            }
        } catch (error) { 
            res.status(HttpStatus.BAD_REQUEST).json({
                message: "Error while creating client",
                error: error instanceof Error ? error.message : "Unknown error",
                stack: error instanceof Error ? error.stack : undefined
            });
            console.log(error)
        }
    }
}   