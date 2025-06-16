import { Request, Response } from "express";
import { IjwtService } from "../../../../domain/interface/serviceInterface/IjwtService";
import { IloginUserUsecase } from "../../../../domain/interface/usecaseInterface/user/authentication/IloginUserUsecase";
import { HttpStatus } from "../../../../domain/entities/httpStatus";
import { setCookie } from "../../../../framework/services/tokenCookieSet";
import { IgoogleloginUsecase } from "../../../../domain/interface/usecaseInterface/user/authentication/IgoogleLoginUsecase";

export class GoogleLoginController {
    private jwtService: IjwtService
    private GoogleLoginUsecase : IgoogleloginUsecase

    constructor(jwtService:IjwtService,GoogleLoginUsecase:IgoogleloginUsecase){
        this.jwtService = jwtService
        this.GoogleLoginUsecase = GoogleLoginUsecase
    }

    async handleLogin(req:Request,res:Response){
        try {
            const { user } = req.body
            const createUser = await this .GoogleLoginUsecase.googleLogin(user)
          
           const ACCESSTOKEN_SECRET_KEY = process.env.ACCESSTOKEN_SECRET_KEY as string
          const REFRESHTOKEN_SECRET_KEY = process.env.REFRESHTOKEN_SECRET_KEY as string
//    console.log(ACCESSTOKEN_SECRET_KEY,REFRESHTOKEN_SECRET_KEY,'dfasdfdfsdf')
       const accessToken = this.jwtService.createAccessToken(ACCESSTOKEN_SECRET_KEY,user._id?.toString() || "",user.role)
       const refreshToken = this.jwtService.createRefreshToken(REFRESHTOKEN_SECRET_KEY,user._id?.toString() || "")
       setCookie(res,refreshToken)
       res.status(HttpStatus.OK).json({message:'login success',createUser,accessToken})
            
        } catch (error) {
             console.log('error while login client', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: "error while login client",
                error: error instanceof Error ? error.message : 'unknown error from login client controller',
            })
        }
    }
}