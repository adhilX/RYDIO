import { Request, Response } from "express";
import { IjwtService } from "../../../../domain/interface/serviceInterface/IjwtService";
import { IloginUserUsecase } from "../../../../domain/interface/usecaseInterface/user/authentication/IloginUserUsecase";
import { HttpStatus } from "../../../../domain/entities/httpStatus";
import { setCookie } from "../../../../framework/services/tokenCookieSet";
import { IgoogleloginUsecase } from "../../../../domain/interface/usecaseInterface/user/authentication/IgoogleLoginUsecase";
import { IredisService } from "../../../../domain/interface/serviceInterface/IredisService";

export class GoogleLoginController {
    private jwtService: IjwtService
    private GoogleLoginUsecase: IgoogleloginUsecase
    private redisService: IredisService
    constructor(jwtService: IjwtService, GoogleLoginUsecase: IgoogleloginUsecase, redisService: IredisService) {
        this.jwtService = jwtService
        this.GoogleLoginUsecase = GoogleLoginUsecase
        this.redisService = redisService
    }

    async handleLogin(req: Request, res: Response) {
        try {
            const { user } = req.body;
            const createUser = await this.GoogleLoginUsecase.googleLogin(user);
            if(!createUser)throw new Error('error while ')
            const ACCESSTOKEN_SECRET_KEY = process.env.ACCESSTOKEN_SECRET_KEY as string;
            const REFRESHTOKEN_SECRET_KEY = process.env.REFRESHTOKEN_SECRET_KEY as string;

            const accessToken = this.jwtService.createAccessToken(
                ACCESSTOKEN_SECRET_KEY,
                createUser._id?.toString() || "",
                createUser.role
            );
            const refreshToken = this.jwtService.createRefreshToken(
                REFRESHTOKEN_SECRET_KEY,
                createUser._id?.toString() || ""
            );
            await this.redisService.set(
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