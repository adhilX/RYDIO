import { Request, Response, Router } from "express";
import { addVehicleController, changePasswordController, changePasswordUserController, editProfileController, googleLoginController, myVehicleController, resendOtpController, sendendOtpController, sendOtpForgotPasswordController, userLoginController, userlogoutController, userRegisterController, verifyForgotPassowordOtpController } from "../../DI/userInject";
import { injectedUserBlockChecker, injectedVerfyToken } from "../../DI/serviceInject";

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
    this.UserRoutes.get('/logout',(req:Request, res:Response)=>{
       userlogoutController.handleClientLogout(req,res)
    })
    
    this.UserRoutes.patch('/editProfile',(req:Request,res:Response)=>{
        editProfileController.handleEditProfle(req,res)
    })
    this.UserRoutes.post('/add-vehicle',(req:Request,res:Response)=>{
        addVehicleController.addVehicle(req,res)
    })
    this.UserRoutes.patch('/change-password',(req:Request,res:Response)=>{
      changePasswordUserController.handleEditProfle(req,res)
    })
    this.UserRoutes.post('/my-vehicle',injectedVerfyToken,injectedUserBlockChecker,(req:Request,res:Response)=>{
    myVehicleController.getMyVehicle(req,res)
    })
    
}}