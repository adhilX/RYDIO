import { Request, Response, Router } from "express";
import { addVehicleController, changePasswordController, changePasswordUserController, changeVehicleStatusController, createBookingController, createPaymentIntentController, deleteVehicleController, editProfileController, getBookedVehicleController, googleLoginController, myBookingController, myVehicleController, resendOtpController, vehicleDetailsController, sendendOtpController, sendOtpForgotPasswordController, uploadIdProofController, userLoginController, userlogoutController, userRegisterController, verifyForgotPassowordOtpController, searchVehicleController, getUserController, getWishlistController, getWalletController, getSecurityDepositController, rideStartController, rideEndController } from "../../DI/userInject";
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
    this.UserRoutes.get('/get-user/:id',injectedVerfyToken,tokenTimeExpiryValidationMiddleware,checkRoleBaseMiddleware('user'),injectedUserBlockChecker,(req:Request,res:Response)=>{
        getUserController.getUser(req,res)
    })
    this.UserRoutes.post('/my-vehicle',injectedVerfyToken,tokenTimeExpiryValidationMiddleware,checkRoleBaseMiddleware('user'),injectedUserBlockChecker,(req:Request,res:Response)=>{
      myVehicleController.getMyVehicle(req,res)
    })
    this.UserRoutes.post('/upload-idproof',injectedVerfyToken,tokenTimeExpiryValidationMiddleware,checkRoleBaseMiddleware('user'),injectedUserBlockChecker,(req:Request,res:Response)=>{
        uploadIdProofController.uploadIdProof(req,res)
    })
    this.UserRoutes.post('/search-vehicle',injectedVerfyToken,tokenTimeExpiryValidationMiddleware,checkRoleBaseMiddleware('user'),injectedUserBlockChecker,(req:Request,res:Response)=>{
        searchVehicleController.searchVehicle(req,res)
    })
    this.UserRoutes.get('/vehicle-details/:id',injectedVerfyToken,tokenTimeExpiryValidationMiddleware,checkRoleBaseMiddleware('user'),injectedUserBlockChecker,(req:Request,res:Response)=>{ 
         vehicleDetailsController.getVehicleDetails(req,res)
    })
    this.UserRoutes.post('/create-booking',injectedVerfyToken,tokenTimeExpiryValidationMiddleware,checkRoleBaseMiddleware('user'),injectedUserBlockChecker,(req:Request,res:Response)=>{
         createBookingController.createBooking(req,res)
    })
    this.UserRoutes.post('/create-payment-intent',injectedVerfyToken,tokenTimeExpiryValidationMiddleware,checkRoleBaseMiddleware('user'),injectedUserBlockChecker,(req:Request,res:Response)=>{
        createPaymentIntentController.createPaymentIntent(req,res)
    })
    this.UserRoutes.post('/my-booking',injectedVerfyToken,tokenTimeExpiryValidationMiddleware,checkRoleBaseMiddleware('user'),injectedUserBlockChecker,(req:Request,res:Response)=>{
        myBookingController.myBooking(req,res)
    })
    this.UserRoutes.delete('/vehicle/:vehicleId',injectedVerfyToken,tokenTimeExpiryValidationMiddleware,checkRoleBaseMiddleware('user'),injectedUserBlockChecker,(req:Request,res:Response)=>{
        deleteVehicleController.deleteVehicle(req,res)
    })
    this.UserRoutes.patch('/vehicle-status/:vehicleId',injectedVerfyToken,tokenTimeExpiryValidationMiddleware,checkRoleBaseMiddleware('user'),injectedUserBlockChecker,(req:Request,res:Response)=>{
        changeVehicleStatusController.changeVehicleStatus(req,res)
    })
    this.UserRoutes.get('/booked-date/:vehicleId',injectedVerfyToken,tokenTimeExpiryValidationMiddleware,checkRoleBaseMiddleware('user'),injectedUserBlockChecker,(req:Request,res:Response)=>{
        getBookedVehicleController.getBookedVehicleDetails(req,res)
    })
    this.UserRoutes.get('/security-deposit',injectedVerfyToken,tokenTimeExpiryValidationMiddleware,checkRoleBaseMiddleware('user'),injectedUserBlockChecker,(req:Request,res:Response)=>{
        getSecurityDepositController.handleGetSecurityDeposit(req,res)
    })
    this.UserRoutes.get('/get-wallet/:userId',injectedVerfyToken,tokenTimeExpiryValidationMiddleware,checkRoleBaseMiddleware('user'),injectedUserBlockChecker,(req:Request,res:Response)=>{
        getWalletController.getWalletDetails(req,res)
    })
    this.UserRoutes.get('/start-ride/:bookingId',injectedVerfyToken,tokenTimeExpiryValidationMiddleware,checkRoleBaseMiddleware('user'),injectedUserBlockChecker,(req:Request,res:Response)=>{
        rideStartController.handleRideStart(req,res)
    })
    this.UserRoutes.get('/end-ride/:bookingId',injectedVerfyToken,tokenTimeExpiryValidationMiddleware,checkRoleBaseMiddleware('user'),injectedUserBlockChecker,(req:Request,res:Response)=>{
        rideEndController.handleRideEnd(req,res)
    })
    
    }
}