import { Request, Response } from "express";
import { IloginUserUsecase } from "../../../../domain/interface/usecaseInterface/user/authentication/IloginUserUsecase";
import { HttpStatus } from "../../../../domain/entities/httpStatus";
import { setCookie } from "../../../../framework/services/tokenCookieSet";
import { IgoogleloginUsecase } from "../../../../domain/interface/usecaseInterface/user/authentication/IgoogleLoginUsecase";

export class UserLoginController {
    private _loginUserUsecase: IloginUserUsecase
    private _GoogleLoginUsecase: IgoogleloginUsecase
    constructor(loginUserUsecase: IloginUserUsecase, GoogleLoginUsecase: IgoogleloginUsecase) {
        this._loginUserUsecase = loginUserUsecase
        this._GoogleLoginUsecase = GoogleLoginUsecase
    }
    async handleLogin(req: Request, res: Response) {
        try {
            const { email, password } = req.body
            const {createdUser,accessToken,refreshToken} = await this._loginUserUsecase.loginUser({ email, password })
            if (!createdUser) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: 'user not found' })
                return
            }
             setCookie(res, refreshToken);
             
            const selectedFields = {
                email: createdUser.email,
                name: createdUser.name,
                phone: createdUser.phone,
                idproof_id: createdUser.idproof_id,
                profile_image: createdUser.profile_image,
                _id: createdUser._id,
                role: createdUser.role,
                status: createdUser.is_blocked,
                is_verified_user: createdUser.is_verified_user,
                last_login: createdUser.last_login,
                vendor_access: createdUser.vendor_access,
                googleVerification: createdUser.googleVerification
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

    async handleGoogleLogin(req: Request, res: Response) {
            try {
                const { user } = req.body;
                const {createdUser,accessToken,refreshToken} = await this._GoogleLoginUsecase.googleLogin(user);
                setCookie(res, refreshToken);
          
                const selectedFields = {
                    email: createdUser.email,
                    name: createdUser.name,
                    idproof_id:createdUser.idproof_id,
                    phone: createdUser.phone,
                    profile_image: createdUser.profile_image,
                    _id: createdUser._id,
                    role: createdUser.role,
                    status: createdUser.is_blocked,
                    is_verified_user: createdUser.is_verified_user,
                    last_login: createdUser.last_login,
                    vendor_access: createdUser.vendor_access,
                    googleVerification: createdUser.googleVerification
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
}