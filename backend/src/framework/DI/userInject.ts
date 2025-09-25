import { SendOtpController } from "../../adapters/controllers/user/authentication/sendlOtpController"
import { UserRegisterController } from "../../adapters/controllers/user/authentication/userRegisterController"
import { UserRepository } from "../../adapters/repository/user/userRepository"
import { HashPassword } from "../services/hashPassword"
import { EmailService } from "../services/emailService"
import { OtpService } from "../services/otpService"
import { JwtService } from "../services/jwtService"
import { UserLoginController } from "../../adapters/controllers/user/authentication/userLoginController"
import { ResendOtpController } from "../../adapters/controllers/user/authentication/resendOtpController"
import { SendOtpForgotPasswordController } from "../../adapters/controllers/user/authentication/forgotPasswordController"
import { VerifyForgotPassowordOtpController } from "../../adapters/controllers/user/authentication/verifyForgotPasswordOtpController"
import { ChangePasswordController } from "../../adapters/controllers/user/authentication/ChangePasswordController"
import { EditProfileController } from "../../adapters/controllers/user/profile-managment/editProfileController"
import { EditProfileUsecase } from "../../useCases/userProfile/editProfileUsecase"
import { AddVehicleController } from "../../adapters/controllers/user/vehicle-mangment/addVehicleController"
import { AddVehicleUsecase } from "../../useCases/vehicles/addVehicleUseCase"
import { VehicleRepository } from "../../adapters/repository/user/vehicleRepository"
import { LocationRepository } from "../../adapters/repository/user/LocationRepository"
import { ChangePasswordUserController } from "../../adapters/controllers/user/profile-managment/changePasswordController"
import { ChangePassword } from "../../useCases/userProfile/ChangePasswordUsecase"
import { MyVehicleController } from "../../adapters/controllers/user/vehicle-mangment/MyVehicleController"
import { MyVehicleUsecase } from "../../useCases/vehicles/MyvehicleUsecase"
import { RedisService } from "../services/redisService"
import { UserLogoutController } from "../../adapters/controllers/user/authentication/userLogoutController"
import { UploadIdProofController } from "../../adapters/controllers/user/profile-managment/uploadIDProofController"
import { UploadIdProofUsecase } from "../../useCases/userProfile/UploadIdProofUsecase"
import { UploadIdProofRepository } from "../../adapters/repository/user/UploadIdProofRepository"
import { SearchVehicleUsecase } from "../../useCases/vehicles/searchVehicleUsecase"
import { SearchVehicleController } from "../../adapters/controllers/user/vehicle-mangment/searchVehicleController"
import { VehilceDetailsController } from "../../adapters/controllers/user/vehicle-mangment/vehilceDetailsController"
import { VehicleDetailsUsecase } from "../../useCases/vehicles/vehicleDetailsUsecase"
import { CreateBookingController } from "../../adapters/controllers/user/booking-managment/createBookingController"
import { CreatePaymentIntentController } from "../../adapters/controllers/user/booking-managment/createPaymentIntentController"
import { StripeService } from "../services/paymentSerivce"
import { MyBookingController } from "../../adapters/controllers/user/booking-managment/myBookingController"
import { BookingRepository } from "../../adapters/repository/booking/bookingRepository"
import { DeleteVehicleUsecase } from "../../useCases/vehicles/deleteVehicleUsecase"
import { DeleteVehicleController } from "../../adapters/controllers/user/vehicle-mangment/deleteVehicleController"
import { ChangeVehicleStatusController } from "../../adapters/controllers/user/vehicle-mangment/changeVehicleStatusController"
import { GetBookedVehicleController } from "../../adapters/controllers/user/booking-managment/getBookedVehicleController"
import { GetUserController } from "../../adapters/controllers/user/profile-managment/getUserController"
import { GetUserUsecase} from "../../useCases/userProfile/GetuserUsecase"
import { WalletRepository } from "../../adapters/repository/wallet/walletRepository"
import { GetWalletController } from "../../adapters/controllers/wallet/getWalletController"
import { AdminWalletRepository } from "../../adapters/repository/wallet/adminWalletRepository"
import { GetSecurityDepositController } from "../../adapters/controllers/user/booking-managment/getSecurityDepositController"
import { TrasationRepository } from "../../adapters/repository/transation/TrasationRepository"
import { RideStartController } from "../../adapters/controllers/user/booking-managment/rideStartController"
import { RideEndController } from "../../adapters/controllers/user/booking-managment/rideEndController"
import { IncomingBookingController } from "../../adapters/controllers/user/booking-managment/incomingBookingController"
import { CancelBookingController } from "../../adapters/controllers/user/booking-managment/cancelBookingController"
import { SendOtpUserUsecase } from "../../useCases/auth/register/sendOtpuserUsecase"
import { VerifyOtpUsecase } from "../../useCases/auth/register/verfyOtpUsecase"
import { CreateUserUsecase } from "../../useCases/auth/register/createUserUsecase"
import { LoginUserUsecase } from "../../useCases/auth/login/loginUserUsercase"
import { GoogleLoginUsecase } from "../../useCases/auth/login/GoogleLoginUsecase"
import { ResendOtpUsecase } from "../../useCases/auth/register/resendOtpUsecase"
import { ForgotPasswordUsecase } from "../../useCases/auth/password/forgotPasswordOtpUsecase"
import { UserLogoutUseCase } from "../../useCases/auth/login/LogoutUserUsecase"
import { ChangePasswordUseCase } from "../../useCases/auth/password/ChangePasswordUsecase"
import { CreateBookingUsecase } from "../../useCases/bookings/createBookingUsecase"
import { CreatePaymentIntentUsecase } from "../../useCases/payments/createPaymentIntentUsecase"
import { MyBookingUsecase } from "../../useCases/bookings/myBookingUsecase"
import { GetBookedVehicleUsecase } from "../../useCases/bookings/GetBookedVehicleUsecase"
import { GetWalletUsecase } from "../../useCases/wallets/getWalletUsecase"
import { GetSecurityDepositUsecase } from "../../useCases/bookings/getSecurityDepositUsecase"
import { RideStartUsecase } from "../../useCases/bookings/rideStartUsecase"
import { RideEndUsecase } from "../../useCases/bookings/rideEndUsecase"
import { IncomingBookingUsecase } from "../../useCases/bookings/incomingBookingUsecase"
import { CancelBookingUseCase } from "../../useCases/bookings/cancelBookingUseCase"
import { WithdrawController } from "../../adapters/controllers/admin/WalletManagment/withdrawController"
import { WithdrawUsecase } from "../../useCases/wallets/withdrawUsecase"
import { ReapplyVehicleController } from "../../adapters/controllers/user/vehicle-mangment/reapplyVehicleController"
import { ReapplyVehicleUsecase } from "../../useCases/vehicles/reapplyVehicleUsecase"
import { ChangeVehicleStatusUsecase } from "../../useCases/vehicles/changeVehicleStatusUsecase"
import { NotificationRepository } from "../../adapters/repository/notification/notificationRepository"
import { GetNotificationUsecase } from "../../useCases/notification/GetNotificationUsecase"
import { NotificationController } from "../../adapters/controllers/notification/notificationController"
import { ReportRepository } from "../../adapters/repository/report/reportRepository"
import { CreateReportUsecase } from "../../useCases/report/CreateReportUsecase"
import { UserReportQueryUsecase } from "../../useCases/report/UserReportQueryUsecase"
import { CreateReportController } from "../../adapters/controllers/report/CreateReportController"
import { GetReportsController } from "../../adapters/controllers/report/GetReportsController"

// regester user 
const otpService = new OtpService()
const emailService = new EmailService()
export const userRepository = new UserRepository()
const bookingRepository = new BookingRepository()
const sendOtpUserUsecase = new SendOtpUserUsecase(otpService,emailService,userRepository)
const verifyOtpUsecase = new VerifyOtpUsecase(otpService)
const hashPassword = new HashPassword()
const redisService = new RedisService()
const walletRepository = new WalletRepository()
const adminWalletRepository = new AdminWalletRepository()
const trasationRepository = new TrasationRepository()
const createUserUsecase = new CreateUserUsecase(userRepository,hashPassword,walletRepository)
export const sendendOtpController = new SendOtpController(sendOtpUserUsecase)
export const  userRegisterController = new UserRegisterController(verifyOtpUsecase,createUserUsecase)


//----------login User-----------

const jwtService = new JwtService()
const loginUserUsecase = new LoginUserUsecase(userRepository,hashPassword,walletRepository,jwtService,redisService)
const googleLoginUsecase = new GoogleLoginUsecase(userRepository,walletRepository,jwtService,redisService)


export const userLoginController = new UserLoginController(loginUserUsecase,googleLoginUsecase)

//-----resendOtp ------------
const resendOtpUsecase = new ResendOtpUsecase(otpService,emailService)
export const resendOtpController = new ResendOtpController(resendOtpUsecase)

//------forgotpassword-------
const forgotPasswordUsecase = new ForgotPasswordUsecase(otpService,emailService,userRepository)
export const sendOtpForgotPasswordController = new SendOtpForgotPasswordController(forgotPasswordUsecase)

//------verifyforgotPassword---------
export const verifyForgotPassowordOtpController = new VerifyForgotPassowordOtpController(verifyOtpUsecase)

//--------change-Passoword--------
const changePasswordUsecase = new ChangePasswordUseCase(userRepository,hashPassword)
export const changePasswordController = new ChangePasswordController(changePasswordUsecase)

//-------logout ----------------
const userLogoutUseCase = new UserLogoutUseCase(redisService,jwtService)
export const userlogoutController = new UserLogoutController(userLogoutUseCase)

//-------update profile------------
const editProfileUseCase = new EditProfileUsecase(userRepository)
export const editProfileController = new EditProfileController(editProfileUseCase)


//---------get user details-------------

const getUserUsecase = new GetUserUsecase(userRepository)
export const getUserController = new GetUserController(getUserUsecase)
//------ add vehicle--------------

const vehicleRepository = new VehicleRepository()
const locationRepository = new LocationRepository()
const addVehicleUsecase = new AddVehicleUsecase(vehicleRepository,locationRepository)
export const addVehicleController = new AddVehicleController(addVehicleUsecase)

//-----change password---------

const changePasswordUserUsecase = new ChangePassword(userRepository,hashPassword)
export const changePasswordUserController = new ChangePasswordUserController(changePasswordUserUsecase)

//---get my vehicle---

const myvehicleUsecase = new MyVehicleUsecase(vehicleRepository)
export const myVehicleController = new MyVehicleController(myvehicleUsecase)

//-------search vehicle------------

const searchVehicleUsecase = new SearchVehicleUsecase(vehicleRepository,bookingRepository)
export const searchVehicleController = new SearchVehicleController(searchVehicleUsecase)

//----get vehicle details------

const vehicleDetailsUsecase = new VehicleDetailsUsecase(vehicleRepository)
export const vehicleDetailsController = new VehilceDetailsController(vehicleDetailsUsecase)

//-------upload Id prooof-------------

const uploadIdProofRepository = new UploadIdProofRepository()
const uploadIdProofUsecase = new UploadIdProofUsecase(uploadIdProofRepository)
export const uploadIdProofController = new UploadIdProofController(uploadIdProofUsecase)

//----------create Booking------------
const createBookingUsecase = new CreateBookingUsecase(bookingRepository,redisService,vehicleRepository,adminWalletRepository,walletRepository,trasationRepository)
export const createBookingController = new CreateBookingController(createBookingUsecase)

//--------create payment intent------------
const stripeService = new StripeService()
const createPaymentIntentUsecase = new CreatePaymentIntentUsecase(stripeService,redisService)
export const createPaymentIntentController = new CreatePaymentIntentController(createPaymentIntentUsecase)

const myBookingUsecase = new MyBookingUsecase(bookingRepository)
export const myBookingController = new MyBookingController(myBookingUsecase)


//------delete vehicle---------
const deleteVehicleUsecase = new DeleteVehicleUsecase(vehicleRepository)
export const deleteVehicleController = new DeleteVehicleController(deleteVehicleUsecase)

//------change vehicle status---------
const changeVehicleStatusUsecase = new ChangeVehicleStatusUsecase(vehicleRepository)
export const changeVehicleStatusController = new ChangeVehicleStatusController(changeVehicleStatusUsecase)


//------get booked vehicle details---------

const getBookedVehicleUsecase = new GetBookedVehicleUsecase(bookingRepository)
export const getBookedVehicleController = new GetBookedVehicleController(getBookedVehicleUsecase)

//------get wallet details---------
const getWalletUsecase = new GetWalletUsecase(walletRepository)
export const getWalletController = new GetWalletController(getWalletUsecase)
    
//------get security deposit details---------
const getSecurityDepositUsecase = new GetSecurityDepositUsecase()
export const getSecurityDepositController = new GetSecurityDepositController(getSecurityDepositUsecase)

//------ride start---------
const rideStartUsecase = new RideStartUsecase(bookingRepository,vehicleRepository)
export const rideStartController = new RideStartController(rideStartUsecase)

//------ride end---------
const rideEndUsecase = new RideEndUsecase(bookingRepository,vehicleRepository,adminWalletRepository)
export const rideEndController = new RideEndController(rideEndUsecase)


//------incoming booking---------
const incomingBookingUsecase = new IncomingBookingUsecase(bookingRepository)
export const incomingBookingController = new IncomingBookingController(incomingBookingUsecase)

//------cancel booking---------
const cancelBookingUsecase = new CancelBookingUseCase(bookingRepository,walletRepository,adminWalletRepository,trasationRepository,vehicleRepository)
export const cancelBookingController = new CancelBookingController(cancelBookingUsecase)

//------withdraw-money----------

const withdrawUsecase = new WithdrawUsecase(bookingRepository,vehicleRepository,walletRepository,adminWalletRepository,trasationRepository,)
export const withdrawController = new WithdrawController(withdrawUsecase)

//------reapply vehicle----------
const reapplyVehicleUsecase = new ReapplyVehicleUsecase(vehicleRepository)
export const reapplyVehicleController = new ReapplyVehicleController(reapplyVehicleUsecase)

//------notification----------
const notificationRepository = new NotificationRepository()
const getNotificationUsecase = new GetNotificationUsecase(notificationRepository)
export const notificationController = new NotificationController(getNotificationUsecase)

//------report----------
const reportRepository = new ReportRepository()
const createReportUsecase = new CreateReportUsecase(reportRepository)
// SOLID-compliant: Use UserReportQueryUsecase for user-specific report operations
const userReportQueryUsecase = new UserReportQueryUsecase(reportRepository)
export const createReportController = new CreateReportController(createReportUsecase)
export const getReportsController = new GetReportsController(userReportQueryUsecase)
