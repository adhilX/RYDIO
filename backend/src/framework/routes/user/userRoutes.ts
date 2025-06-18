import { Request, Response, Router } from "express";
import { resendOtpController, sendendOtpController, sendOtpForgotPasswordController, userLoginController, userRegisterController, verifyForgotPassowordOtpController } from "../../DI/userInject";

export class UserRoutes {

    public UserRoutes : Router

    constructor() {
        this.UserRoutes = Router();
        this.setRoutes();
    }

    private setRoutes(){
    this.UserRoutes.post('/signup', (req: Request, res:Response) => {
       sendendOtpController.sendOtp(req,res)
    })
    this.UserRoutes.post('/verifyotp',(req:Request,res:Response)=>{
       userRegisterController.register(req,res)
    })
    this.UserRoutes.post('/login',(req:Request, res:Response)=>{
        userLoginController.handleLogin(req,res)
    })
    this.UserRoutes.post('/resendotp',(req:Request, res:Response)=>{
        resendOtpController.resendOpt(req,res)
    })
    this.UserRoutes.post('/forgotpassword',(req:Request, res:Response)=>{
       sendOtpForgotPasswordController.handleForgotPassword(req,res)
    })
    this.UserRoutes.post('/verifyforgotpasswordotp',(req:Request, res:Response)=>{
       verifyForgotPassowordOtpController.verify(req,res)
    })
}}