import { SendOtpController } from "../../adapters/controllers/user/authentication/sendlOtpController"
import { UserRegisterController } from "../../adapters/controllers/user/authentication/userRegisterController"
import { UserRepostory } from "../../adapters/repository/user/userRepository"
import { CreateUserUsecase } from "../../useCases/user/auth/createUserUsecase"
import { SendOtpUserUsecase } from "../../useCases/user/auth/otpUsecase/sendOtpuserUsecase"
import { VerifyOtpUsecase } from "../../useCases/user/auth/otpUsecase/verfyOtpUsecase"
import { HashPassword } from "../services/hashPassword"
import { EmailService } from "../services/emailService"
import { OtpService } from "../services/otpService"
import { LoginUserUsecase } from "../../useCases/user/auth/loginUserUsercase"
import { JwtService } from "../services/jwtService"
import { UserLoginController } from "../../adapters/controllers/user/authentication/userLoginController"
import { GoogleLoginUsecase } from "../../useCases/user/auth/GoogleLoginUsecase"
import { GoogleLoginController } from "../../adapters/controllers/user/authentication/googleLoginController"
import { ResendOtpController } from "../../adapters/controllers/user/authentication/resendOtpController"
import { ResendOtpUsecase } from "../../useCases/user/auth/otpUsecase/resendOtpUsecase"
import { SendOtpForgotPasswordController } from "../../adapters/controllers/user/authentication/sendOtpforgotPasswordController"
import { ForgotPasswordUsecase } from "../../useCases/user/auth/SendforgotPasswordOtpUsecase"
import { VerifyForgotPassowordOtpController } from "../../adapters/controllers/user/authentication/verifyForgotPasswordOtpController"
import { ChangePasswordController } from "../../adapters/controllers/user/authentication/ChangePasswordController"
import { ChangePasswordUseCase } from "../../useCases/user/auth/ChangePasswordUsecase"
import { EditProfileController } from "../../adapters/controllers/user/profile-managment/editProfileController"
import { EditProfileUsecase } from "../../useCases/user/editProfileUsecase"
import { AddVehicleController } from "../../adapters/controllers/user/vehicle-mangment/addVehicleController"
import { AddVehicleUsecase } from "../../useCases/user/vehicle/addVehicleUseCase"
import { VehicleRepository } from "../../adapters/repository/user/vehicleRepository"
import { LocationRepository } from "../../adapters/repository/user/LocationRepository"
import { ChangePasswordUserController } from "../../adapters/controllers/user/profile-managment/changePasswordController"
import { ChangePassword } from "../../useCases/user/ChangePasswordUsecase"
import { MyVehicleController } from "../../adapters/controllers/user/vehicle-mangment/MyVehicleController"
import { MyVehicleUsecase } from "../../useCases/user/vehicle/MyvehicleUsecase"
import { RedisService } from "../services/redisService"
import { UserLogoutController } from "../../adapters/controllers/user/authentication/userLogoutController"
import { UserLogoutUseCase } from "../../useCases/user/auth/LogoutUserUsecase"
import { UploadIdProofController } from "../../adapters/controllers/user/profile-managment/uploadIDProofController"
import { UploadIdProofUsecase } from "../../useCases/user/UploadIdProofUsecase"
import { UploadIdProofRepository } from "../../adapters/repository/user/UploadIdProofRepository"
import { SearchVehicleUsecase } from "../../useCases/user/vehicle/searchVehicleUsecase"
import { SearchVehicleController } from "../../adapters/controllers/user/vehicle-mangment/searchVehicleController"
import { VehilceDetailsController } from "../../adapters/controllers/user/vehicle-mangment/vehilceDetailsController"
import { VehicleDetailsUsecase } from "../../useCases/user/vehicle/vehicleDetailsUsecase"
import { CreateBookingUsecase } from "../../useCases/booking/createBookingUsecase"
import { CreateBookingController } from "../../adapters/controllers/user/booking-managment/createBookingController"
import { CreatePaymentIntentController } from "../../adapters/controllers/user/booking-managment/createPaymentIntentController"
import { CreatePaymentIntentUsecase } from "../../useCases/booking/createPaymentIntentUsecase"
import { StripeService } from "../services/paymentSerivce"
import { MyBookingController } from "../../adapters/controllers/user/booking-managment/myBookingController"
import { MyBookingUsecase } from "../../useCases/booking/myBookingUsecase"
import { BookingRepository } from "../../adapters/repository/booking/bookingRepository"
import { DeleteVehicleUsecase } from "../../useCases/user/vehicle/deleteVehicleUsecase"
import { DeleteVehicleController } from "../../adapters/controllers/user/vehicle-mangment/deleteVehicleController"
import { ChangeVehicleStatusUsecase } from "../../useCases/user/vehicle/changeVehicleStatusUsecase"
import { ChangeVehicleStatusController } from "../../adapters/controllers/user/vehicle-mangment/changeVehicleStatusController"
import { GetBookedVehicleController } from "../../adapters/controllers/user/booking-managment/getBookedVehicleController"
import { GetBookedVehicleUsecase } from "../../useCases/booking/GetBookedVehicleUsecase"
import { GetUserController } from "../../adapters/controllers/user/profile-managment/getUserController"
import { GetUserUsecase} from "../../useCases/user/auth/GetuserUsecase"
import { GetWishlistController } from "../../adapters/controllers/user/wishlist-magagment/getWishlistController"
import { GetWishlistUseCase } from "../../useCases/user/wishlist/getWishlistUseCase"
import { WishlistRepository } from "../../adapters/repository/user/wishlistRepository"
import { WalletRepository } from "../../adapters/repository/wallet/walletRepository"
import { GetWalletUsecase } from "../../useCases/user/wallet/getWalletUsecase"
import { GetWalletController } from "../../adapters/controllers/wallet/getWalletController"
import { AdminWalletRepository } from "../../adapters/repository/wallet/adminWalletRepository"
import { SecurityDepositRepository } from "../../adapters/repository/booking/SecurityDepositRepository"
import { GetSecurityDepositUsecase } from "../../useCases/booking/getSecurityDepositUsecase"
import { GetSecurityDepositController } from "../../adapters/controllers/user/booking-managment/getSecurityDepositController"

// regester user 
const otpService = new OtpService()
const emailService = new EmailService()
const userRepostory = new UserRepostory()
const bookingRepository = new BookingRepository()
const sendOtpUserUsecase = new SendOtpUserUsecase(otpService,emailService,userRepostory)
const verifyOtpUsecase = new VerifyOtpUsecase(otpService)
const hashPassword = new HashPassword()
const redisService = new RedisService()
const walletRepository = new WalletRepository()
const adminWalletRepository = new AdminWalletRepository()
const createUserUsecase = new CreateUserUsecase(userRepostory,hashPassword,walletRepository)
export const sendendOtpController = new SendOtpController(sendOtpUserUsecase)
export const  userRegisterController = new UserRegisterController(verifyOtpUsecase,createUserUsecase)


//----------login User-----------

const jwtService = new JwtService()
const loginUserUsecase = new LoginUserUsecase(userRepostory,hashPassword,walletRepository)
export const userLoginController = new UserLoginController(jwtService,loginUserUsecase,redisService)

//-------Google Login ---------

const googleLoginUsecase = new GoogleLoginUsecase(userRepostory,walletRepository)
export const googleLoginController = new GoogleLoginController(jwtService,googleLoginUsecase,redisService)

//-----resendOtp ------------
const resendOtpUsecase = new ResendOtpUsecase(otpService,emailService)
export const resendOtpController = new ResendOtpController(resendOtpUsecase)

//------forgotpassword-------
const forgotPasswordUsecase = new ForgotPasswordUsecase(otpService,emailService,userRepostory)
export const sendOtpForgotPasswordController = new SendOtpForgotPasswordController(forgotPasswordUsecase)

//------verifyforgotPassword---------
export const verifyForgotPassowordOtpController = new VerifyForgotPassowordOtpController(verifyOtpUsecase)

//--------change-Passoword--------
const changePasswordUsecase = new ChangePasswordUseCase(userRepostory,hashPassword)
export const changePasswordController = new ChangePasswordController(changePasswordUsecase)

//-------logout ----------------
const userLogoutUseCase = new UserLogoutUseCase(redisService,jwtService)
export const userlogoutController = new UserLogoutController(userLogoutUseCase)

//-------update profile------------
const editProfileUseCase = new EditProfileUsecase(userRepostory)
export const editProfileController = new EditProfileController(editProfileUseCase)


//---------get user details-------------

const getUserUsecase = new GetUserUsecase(userRepostory)
export const getUserController = new GetUserController(getUserUsecase)
//------ add vehicle--------------

const vehicleRepository = new VehicleRepository()
const locationRepository = new LocationRepository()
const addVehicleUsecase = new AddVehicleUsecase(vehicleRepository,locationRepository)
export const addVehicleController = new AddVehicleController(addVehicleUsecase)

//-----change password---------

const changePasswordUserUsecase = new ChangePassword(userRepostory,hashPassword)
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

const createBookingUsecase = new CreateBookingUsecase(bookingRepository,redisService,vehicleRepository,adminWalletRepository)
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
    
//------get wishlist details---------
const wishlistRepository = new WishlistRepository() 
const getWishlistUseCase = new GetWishlistUseCase(wishlistRepository)
export const getWishlistController = new GetWishlistController(getWishlistUseCase)

//------get security deposit details---------
const securityDepositRepository = new SecurityDepositRepository()
const getSecurityDepositUsecase = new GetSecurityDepositUsecase(securityDepositRepository)
export const getSecurityDepositController = new GetSecurityDepositController(getSecurityDepositUsecase)