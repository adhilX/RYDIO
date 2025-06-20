import { IverfyOtpUsecase } from "../../../../domain/interface/usecaseInterface/user/authentication/IotpUsecase/IverfyOtpUsecase";
import { Request, Response } from "express";
import { IcreateUserUsecase } from "../../../../domain/interface/usecaseInterface/user/authentication/userUsecaseInterface";

export class UserRegisterController {
    private verifyOtpUsecase : IverfyOtpUsecase
    private createuserUsecase : IcreateUserUsecase

    constructor(verifyOtpUsecase:IverfyOtpUsecase,createuserUsecase:IcreateUserUsecase){
        this.verifyOtpUsecase = verifyOtpUsecase
        this.createuserUsecase = createuserUsecase
    }
     async register(req: Request, res: Response): Promise<void> {
        console.log(req.body,'ggg')
        const { user, otp } = req.body as { user: any; otp: string };
        try {
            console.log(user,otp)
            const verify = await this.verifyOtpUsecase.verifyOtp(user?.email, otp);
            console.log(verify)
            if (verify) {
                const newUser = await this.createuserUsecase.createUser(user);
                res.status(201).json({ message: 'user created', newUser });
            } else {
                res.status(400).json({ error: 'OTP verification failed' });
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