import { Request, Response, Router } from "express";
import { changePasswordController, googleLoginController, resendOtpController, sendendOtpController, sendOtpForgotPasswordController, userLoginController, userRegisterController, verifyForgotPassowordOtpController } from "../../DI/userInject";
import { blockUserController } from "../../DI/adminInject";

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
    
    this.UserRoutes.post('/googlelogin',(req:Request, res:Response)=>{
        googleLoginController.handleLogin(req,res)
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
    this.UserRoutes.patch('/changepassword',(req:Request, res:Response)=>{
       changePasswordController.handleForgetPassword(req,res)
    })
    this.UserRoutes.patch('/logout',(req:Request, res:Response)=>{
       blockUserController.handleClientBlock(req,res)
    })
}}