import { Request, Response } from "express";
import { IverfyOtpUsecase } from "../../../../domain/interface/usecaseInterface/auth/register/IverfyOtpUsecase";
import { IcreateUserUsecase } from "../../../../domain/interface/usecaseInterface/auth/register/userUsecaseInterface";

export class UserRegisterController {
    private _verifyOtpUsecase : IverfyOtpUsecase
    private _createuserUsecase : IcreateUserUsecase

    constructor(verifyOtpUsecase:IverfyOtpUsecase,createuserUsecase:IcreateUserUsecase){
        this._verifyOtpUsecase = verifyOtpUsecase
        this._createuserUsecase = createuserUsecase
    }
     async register(req: Request, res: Response): Promise<void> {
        console.log(req.body,'ggg')
        const { user, otp } = req.body as { user: any; otp: string };
        try {
            console.log(user,otp)
            const verify = await this._verifyOtpUsecase.verifyOtp(user?.email, otp);
            console.log(verify)
            if (verify) {
                const newUser = await this._createuserUsecase.createUser(user);
                res.status(201).json({ message: 'user created', newUser });
            } else {
                res.status(400).json({ error: 'Invalid OTP' });
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