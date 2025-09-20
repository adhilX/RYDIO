import { Request, Response } from "express";
import { HttpStatus } from "../../../../domain/entities/httpStatus";
import { ICreateUserUsecase } from "../../../../domain/interface/usecaseInterface/auth/register/userUsecaseInterface";
import { IVerifyOtpUsecase } from "../../../../domain/interface/usecaseInterface/auth/register/IVerifyOtpUsecase";

export class UserRegisterController {
    private _verifyOtpUsecase : IVerifyOtpUsecase
    private _createuserUsecase : ICreateUserUsecase

    constructor(verifyOtpUsecase:IVerifyOtpUsecase,createuserUsecase:ICreateUserUsecase){
        this._verifyOtpUsecase = verifyOtpUsecase
        this._createuserUsecase = createuserUsecase
    }
     async register(req: Request, res: Response): Promise<void> {
        const { user, otp } = req.body as { user: any; otp: string };
        try {
            const verify = await this._verifyOtpUsecase.verifyOtp(user?.email, otp);
            if (verify) {
                const newUser = await this._createuserUsecase.createUser(user);
                res.status(HttpStatus.CREATED).json({ message: 'user created', newUser });
            } else {
                res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid OTP' });
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