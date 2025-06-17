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
import { ForgotPasswordController } from "../../adapters/controllers/user/authentication/forgotPasswordController"
import { ForgotPasswordUsecase } from "../../useCases/user/auth/forgotPasswordUsecase"

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

//------forgotpassword-------
const forgotPasswordUsecase = new ForgotPasswordUsecase(otpService,emailService,userRepostory)
export const forgotPasswordController = new ForgotPasswordController(forgotPasswordUsecase)

//-------Google Login ---------

const googleLoginUsecase = new GoogleLoginUsecase(userRepostory)
export const googleLoginController = new GoogleLoginController(jwtService,googleLoginUsecase)

//-----resendOtp ------------
const resendOtpUsecase = new ResendOtpUsecase(otpService,emailService)
export const resendOtpController = new ResendOtpController(resendOtpUsecase)