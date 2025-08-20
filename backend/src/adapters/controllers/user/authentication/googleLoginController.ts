import { Request, Response } from "express";
import { IjwtService } from "../../../../domain/interface/serviceInterface/IjwtService";
import { HttpStatus } from "../../../../domain/entities/httpStatus";
import { setCookie } from "../../../../framework/services/tokenCookieSet";
import { IredisService } from "../../../../domain/interface/serviceInterface/IredisService";
import { IgoogleloginUsecase } from "../../../../domain/interface/usecaseInterface/auth/login/IgoogleLoginUsecase";

export class GoogleLoginController {
    private _jwtService: IjwtService
    private _GoogleLoginUsecase: IgoogleloginUsecase
    private _redisService: IredisService
    constructor(jwtService: IjwtService, GoogleLoginUsecase: IgoogleloginUsecase, redisService: IredisService) {
        this._jwtService = jwtService
        this._GoogleLoginUsecase = GoogleLoginUsecase
        this._redisService = redisService
    }

    async handleLogin(req: Request, res: Response) {
        try {
            const { user } = req.body;
            const createUser = await this._GoogleLoginUsecase.googleLogin(user);
            if(!createUser)throw new Error('error while ')
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
                idproof_id:createUser.idproof_id,
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
}