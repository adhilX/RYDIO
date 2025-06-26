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
import { EditProfileController } from "../../adapters/controllers/user/editProfileController"
import { EditProfileUsecase } from "../../useCases/user/editProfileUsecase"
import { AddVehicleController } from "../../adapters/controllers/user/addVehicleController"
import { AddVehicleUsecase } from "../../useCases/user/vehicle/addVehicleUseCase"
import { VehicleRepository } from "../../adapters/repository/user/vehicleRepository"
import { LocationRepository } from "../../adapters/repository/user/LocationRepository"

// regester user 
const otpService = new OtpService()
const emailService = new EmailService()
const userRepostory = new UserRepostory()
const sendOtpUserUsecase = new SendOtpUserUsecase(otpService,emailService,userRepostory)
const verifyOtpUsecase = new VerifyOtpUsecase(otpService)
const hashPassword = new HashPassword()
const createUserUsecase = new CreateUserUsecase(userRepostory,hashPassword)
export const sendendOtpController = new SendOtpController(sendOtpUserUsecase)
export const  userRegisterController = new UserRegisterController(verifyOtpUsecase,createUserUsecase)


//----------login User-----------

const jwtService = new JwtService()
const loginUserUsecase = new LoginUserUsecase(userRepostory,hashPassword)
export const userLoginController = new UserLoginController(jwtService,loginUserUsecase)

//-------Google Login ---------

const googleLoginUsecase = new GoogleLoginUsecase(userRepostory)
export const googleLoginController = new GoogleLoginController(jwtService,googleLoginUsecase)

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


//-------update profile------------
const editProfileUseCase = new EditProfileUsecase(userRepostory)
export const editProfileController = new EditProfileController(editProfileUseCase)

//------ add vehicle--------------

const vehicleRepository = new VehicleRepository()
const locationRepository = new LocationRepository()
const addVehicleUsecase = new AddVehicleUsecase(vehicleRepository,locationRepository)
export const addVehicleController = new AddVehicleController(addVehicleUsecase)