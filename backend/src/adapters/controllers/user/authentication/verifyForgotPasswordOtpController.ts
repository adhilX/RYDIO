import { IverfyOtpUsecase } from "../../../../domain/interface/usecaseInterface/user/authentication/IotpUsecase/IverfyOtpUsecase";
import { Request, Response } from "express";

export class VerifyForgotPassowordOtpController {
    private verifyOtpUsecase : IverfyOtpUsecase


    constructor(verifyOtpUsecase:IverfyOtpUsecase){
        this.verifyOtpUsecase = verifyOtpUsecase
    }
     async verify(req: Request, res: Response): Promise<void> {

        const { email, otp } = req.body as { email: string; otp: string };
        try {
            const verify = await this.verifyOtpUsecase.verifyOtp(email, otp);
            if (verify) {
                res.status(200).json({ message: 'OTP verified successfully', data: verify });
            } else {
                res.status(400).json({ error: 'Invalid or expired OTP' });
            }
        } catch (error) { 
            res.status(400).json({
                message: "Error while creating client",
                error: error instanceof Error ? error.message : "Unknown error",
                stack: error instanceof Error ? error.stack : undefined
            });
            console.log(error)
        }
    }
}   