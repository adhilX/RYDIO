import { Request, Response } from "express"
import { IadminLoginUseCase } from "../../../domain/interface/usecaseInterface/admin/Auth/IadminLoginUsecase"
import { HttpStatus } from "../../../domain/entities/httpStatus"
import { setCookie } from "../../../framework/services/tokenCookieSet"

export class AdminLoginController {
    private adminLoginUseCase: IadminLoginUseCase
    constructor(adminLoginUseCase: IadminLoginUseCase) {
        this.adminLoginUseCase = adminLoginUseCase
    }

    async handleAdminLogin(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body
            if (!email) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: "invalid email" })
                return
            } else if (!password) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: "invalid password" })
                return
            }
            const {adminData,accessToken,refreshToken} = await this.adminLoginUseCase.handleLogin({email, password})
    
            setCookie(res, refreshToken)
            res.status(HttpStatus.OK).json({ message: 'login success', adminData, accessToken })
        } catch (error) {
            console.log('error while admin login', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'error while login admin',
                error: error instanceof Error ? error.message : 'error while login admin'
            })
        }
    }
}