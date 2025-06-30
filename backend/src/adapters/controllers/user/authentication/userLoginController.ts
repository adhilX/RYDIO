import { Request, Response } from "express";
import { IjwtService } from "../../../../domain/interface/serviceInterface/IjwtService";
import { IloginUserUsecase } from "../../../../domain/interface/usecaseInterface/user/authentication/IloginUserUsecase";
import { HttpStatus } from "../../../../domain/entities/httpStatus";
import { setCookie } from "../../../../framework/services/tokenCookieSet";
import { IredisService } from "../../../../domain/interface/serviceInterface/IredisService";

export class UserLoginController {
    private jwtService: IjwtService
    private loginUserUsecase : IloginUserUsecase
    private redisService: IredisService
    constructor(jwtService:IjwtService,loginUserUsecase:IloginUserUsecase,redisService:IredisService){
        this.jwtService = jwtService
        this.loginUserUsecase =loginUserUsecase
        this.redisService = redisService

    }

    async handleLogin(req:Request,res:Response){
        try {
            const { email, password } = req.body
            const user = await this .loginUserUsecase.loginUser(email,password)
            if(!user){
               res.status(HttpStatus.BAD_REQUEST).json({message:'user not found'})
               return 
            }
           const ACCESSTOKEN_SECRET_KEY = process.env.ACCESSTOKEN_SECRET_KEY as string
          const REFRESHTOKEN_SECRET_KEY = process.env.REFRESHTOKEN_SECRET_KEY as string
//    console.log(ACCESSTOKEN_SECRET_KEY,REFRESHTOKEN_SECRET_KEY,'dfasdfdfsdf')
       const accessToken = this.jwtService.createAccessToken(ACCESSTOKEN_SECRET_KEY,user._id?.toString() || "",user.role)
       const refreshToken = this.jwtService.createRefreshToken(REFRESHTOKEN_SECRET_KEY,user._id?.toString() || "")
        await this.redisService.set(`user:${user.role}:${user._id}`, 15 * 60, JSON.stringify(user.is_blocked))
       setCookie(res,refreshToken)
        const selectedFields = {
                email: user.email,
                name: user.name,
                phone: user.phone,
                profile_image: user.profile_image,
                _id: user._id,
                role: user.role,
                status: user.is_blocked,
                is_verified_user :user.is_verified_user,
                last_login:user.last_login,
                vendor_access:user.vendor_access,
                googleVerification:user.googleVerification
            }
       res.status(HttpStatus.OK).json({message:'login success',user:selectedFields,accessToken})
            
        } catch (error) {
             console.log('error while login client', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: "error while login client",
                error: error instanceof Error ? error.message : 'unknown error from login client controller',
            })
        }
    }
}