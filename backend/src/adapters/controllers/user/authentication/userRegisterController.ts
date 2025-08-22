import { IverfyOtpUsecase } from "../../../../domain/interface/usecaseInterface/user/authentication/IotpUsecase/IverfyOtpUsecase";
import { Request, Response } from "express";
import { IcreateUserUsecase } from "../../../../domain/interface/usecaseInterface/user/authentication/userUsecaseInterface";
import { HttpStatus } from "../../../../domain/entities/httpStatus";

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