import { Request, Response, Router } from "express";
import { addVehicleController, changePasswordController, changePasswordUserController, editProfileController, googleLoginController, myVehicleController, resendOtpController, searchVehicleController, sendendOtpController, sendOtpForgotPasswordController, uploadIdProofController, userLoginController, userlogoutController, userRegisterController, vehilceDetailsController, verifyForgotPassowordOtpController } from "../../DI/userInject";
import { injectedUserBlockChecker, injectedVerfyToken, tokenTimeExpiryValidationMiddleware } from "../../DI/serviceInject";
import { checkRoleBaseMiddleware } from "../../../adapters/middlewares/checkRoleBasedMIddleware";

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
    this.UserRoutes.get('/logout',(req:Request, res:Response)=>{
       userlogoutController.handleClientLogout(req,res)
    })
    this.UserRoutes.patch('/changepassword',injectedVerfyToken,tokenTimeExpiryValidationMiddleware,checkRoleBaseMiddleware('user'),injectedUserBlockChecker,(req:Request, res:Response)=>{
       changePasswordController.handleForgetPassword(req,res)
    })
    
    this.UserRoutes.patch('/editProfile',injectedVerfyToken,tokenTimeExpiryValidationMiddleware,checkRoleBaseMiddleware('user'),injectedUserBlockChecker,(req:Request,res:Response)=>{
        editProfileController.handleEditProfle(req,res)
    })
    this.UserRoutes.post('/add-vehicle',injectedVerfyToken,tokenTimeExpiryValidationMiddleware,checkRoleBaseMiddleware('user'),injectedUserBlockChecker,(req:Request,res:Response)=>{
        addVehicleController.addVehicle(req,res)
    })
    this.UserRoutes.patch('/change-password',injectedVerfyToken,tokenTimeExpiryValidationMiddleware,checkRoleBaseMiddleware('user'),injectedUserBlockChecker,(req:Request,res:Response)=>{
      changePasswordUserController.handleEditProfle(req,res)
    })
    this.UserRoutes.post('/my-vehicle',injectedVerfyToken,tokenTimeExpiryValidationMiddleware,checkRoleBaseMiddleware('user'),injectedUserBlockChecker,(req:Request,res:Response)=>{
      myVehicleController.getMyVehicle(req,res)
    })
    this.UserRoutes.post('/upload-idproof',injectedVerfyToken,tokenTimeExpiryValidationMiddleware,checkRoleBaseMiddleware('user'),injectedUserBlockChecker,(req:Request,res:Response)=>{
        uploadIdProofController.uploadIdProof(req,res)
    })
    this.UserRoutes.post('/search-vehicle',(req:Request,res:Response)=>{
        searchVehicleController.searchVehicle(req,res)
    })
    this.UserRoutes.get('/vehicle-details/:id',(req:Request,res:Response)=>{ 
         vehilceDetailsController.getVehicleDetails(req,res)
    })
}}