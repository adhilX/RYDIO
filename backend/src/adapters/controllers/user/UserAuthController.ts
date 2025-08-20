import { IloginUserUsecase } from "../../../domain/interface/usecaseInterface/auth/login/IloginUserUsecase"
import { IjwtService } from "../../../domain/interface/serviceInterface/IjwtService"
import { IredisService } from "../../../domain/interface/serviceInterface/IredisService"
import { HttpStatus } from "../../../domain/entities/httpStatus"
import { setCookie } from "../../../framework/services/tokenCookieSet"
import { Request, Response } from "express"
import { IcreateUserUsecase } from "../../../domain/interface/usecaseInterface/auth/register/userUsecaseInterface"
import { IverfyOtpUsecase } from "../../../domain/interface/usecaseInterface/auth/register/IverfyOtpUsecase"
import { IuserLogoutUsecase } from "../../../domain/interface/usecaseInterface/auth/login/IuserLogoutUsecase"
import { IgoogleloginUsecase } from "../../../domain/interface/usecaseInterface/auth/login/IgoogleLoginUsecase"
import { IForgotPasswordUsecase } from "../../../domain/interface/usecaseInterface/auth/password/IForgotPasswordUsecase"
import { IchangePasswordUsecase } from "../../../domain/interface/usecaseInterface/auth/password/IchangePasswordUsecase"
import { IresendOtpUsecase } from "../../../domain/interface/usecaseInterface/auth/register/IresendOtpUsecase"
import { IsendOptUsecase } from "../../../domain/interface/usecaseInterface/auth/register/IsendOtpUsecase"

export class AuthController {
    constructor(
        private _loginUserUsecase: IloginUserUsecase,
        private _jwtService: IjwtService,
        private _redisService: IredisService,
        private _verifyOtpUsecase: IverfyOtpUsecase,
        private _createuserUsecase: IcreateUserUsecase,
        private _logoutUserusecase: IuserLogoutUsecase,
        private _GoogleLoginUsecase: IgoogleloginUsecase,
        private _forgotPasswordUsecase: IForgotPasswordUsecase,
        private _changePasswordUsecase: IchangePasswordUsecase,
        private _ResendOtpUsecase: IresendOtpUsecase,
        private _userSendOtpUsecase: IsendOptUsecase
    ) { }

    async handleLogin(req: Request, res: Response) {
        try {
            const { email, password } = req.body
            const user = await this._loginUserUsecase.loginUser({ email, password })
            if (!user) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: 'user not found' })
                return
            }
            const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY as string
            const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY as string

            const accessToken = this._jwtService.createAccessToken(ACCESS_TOKEN_KEY, user._id?.toString() || "", user.role)
            const refreshToken = this._jwtService.createRefreshToken(REFRESH_TOKEN_KEY, user._id?.toString() || "")
            await this._redisService.set(`user:${user.role}:${user._id}`, 15 * 60, JSON.stringify(user.is_blocked))
            setCookie(res, refreshToken)
            const selectedFields = {
                email: user.email,
                name: user.name,
                phone: user.phone,
                idproof_id: user.idproof_id,
                profile_image: user.profile_image,
                _id: user._id,
                role: user.role,
                status: user.is_blocked,
                is_verified_user: user.is_verified_user,
                last_login: user.last_login,
                vendor_access: user.vendor_access,
                googleVerification: user.googleVerification
            }
            res.status(HttpStatus.OK).json({ message: 'login success', user: selectedFields, accessToken })

        } catch (error) {
            console.log('error while login client', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: "error while login client",
                error: error instanceof Error ? error.message : 'unknown error from login client controller',
            })
        }
    }

    async register(req: Request, res: Response): Promise<void> {
        console.log(req.body, 'ggg')
        const { user, otp } = req.body as { user: any; otp: string };
        try {
            console.log(user, otp)
            const verify = await this._verifyOtpUsecase.verifyOtp(user?.email, otp);
            console.log(verify)
            if (verify) {
                const newUser = await this._createuserUsecase.createUser(user);
                res.status(201).json({ message: 'user created', newUser });
            } else {
                res.status(400).json({ error: 'Invalid OTP' });
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

    async verify(req: Request, res: Response): Promise<void> {

        const { email, otp } = req.body as { email: string; otp: string };
        try {
            const verify = await this._verifyOtpUsecase.verifyOtp(email, otp);
            if (verify) {
                res.status(200).json({ message: 'OTP verified successfully', data: verify });
            } else {
                res.status(400).json({ error: 'Invalid or expired OTP' });
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

    async handleClientLogout(req: Request, res: Response): Promise<void> {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401).json({ message: 'Unauthorized' });
                return
            }
            const token = authHeader.split(' ')[1];

            await this._logoutUserusecase.clientLogout({ token });
            res.status(HttpStatus.OK).json({ message: "Logout successful" });

        } catch (error) {
            console.log('error while handling logout client', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'error while handling logout client',
                error: error instanceof Error ? error.message : 'error while handling logout client'
            })
        }
    }

    async handleGoogleLogin(req: Request, res: Response) {
        try {
            const { user } = req.body;
            const createUser = await this._GoogleLoginUsecase.googleLogin(user);
            if (!createUser) throw new Error('error while ')
            const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY as string;
            const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY as string;

            const accessToken = this._jwtService.createAccessToken(
                ACCESS_TOKEN_KEY,
                createUser._id?.toString() || "",
                createUser.role
            );
            const refreshToken = this._jwtService.createRefreshToken(
                REFRESH_TOKEN_KEY,
                createUser._id?.toString() || ""
            );
            await this._redisService.set(
                `user:${createUser.role}:${createUser._id}`,
                15 * 60,
                JSON.stringify(createUser.is_blocked)
            );

            setCookie(res, refreshToken);

            const selectedFields = {
                email: createUser.email,
                name: createUser.name,
                idproof_id: createUser.idproof_id,
                phone: createUser.phone,
                profile_image: createUser.profile_image,
                _id: createUser._id,
                role: createUser.role,
                status: createUser.is_blocked,
                is_verified_user: createUser.is_verified_user,
                last_login: createUser.last_login,
                vendor_access: createUser.vendor_access,
                googleVerification: createUser.googleVerification
            };
            res.status(HttpStatus.OK).json({ message: 'login success', createUser: selectedFields, accessToken });
        } catch (error) {
            console.log('error while login client', error);
            res.status(HttpStatus.BAD_REQUEST).json({
                message: "error while login client",
                error: error instanceof Error ? error.message : 'unknown error from login client controller',
            });
        }
    }

    async handleSendOtpForgotPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: "Email is required" });
                return;
            }
            await this._forgotPasswordUsecase.execute(email);
            res.status(HttpStatus.OK).json({ message: "Otp sent to your email." });
        } catch (error) {
            console.error("Error in forgot password:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Failed to send password reset instructions",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    async handleForgetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email, newPassword } = req.body
            const forgettingPassWord = await this._changePasswordUsecase.ChangePassword({ email, newPassword })
            if (!forgettingPassWord) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: 'error while forget password user' })
                return
            }
            res.status(HttpStatus.OK).json({ message: "password changed" })
        } catch (error) {
            console.log('error while forget password', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'error while forget password client',
                error: error instanceof Error ? error.message : 'error while forget password client'
            })
        }
    }

    async resendOpt(req: Request, res: Response): Promise<void> {
        try {
            const { user } = req.body
            console.log(user, 'ggg')
            await this._ResendOtpUsecase.resendOtp(user?.email)
            res.status(Number(HttpStatus.OK)).json({ message: 'OTP sent successfully' })
            return
        } catch (error) {
            console.error('error while sending otp', error)
            res.status(Number(HttpStatus.BAD_REQUEST)).json({ message: "error while sending otp test", error: error instanceof Error ? error.message : 'error while sending otp' })
        }
    }

    async sendOtp(req: Request, res: Response): Promise<void> {
        try {
            const { user } = req.body
            console.log(user, 'ggg')
            await this._userSendOtpUsecase.execute(user?.email)
            res.status(HttpStatus.OK).json({ message: 'OTP sended successfully' })
            return
        } catch (error) {
            console.error('error while sending otp', error)
            res.status(HttpStatus.BAD_REQUEST).json({ message: "error while sending otp test", error: error instanceof Error ? error.message : 'error while sending otp' })
        }
    }
}
