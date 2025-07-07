import { Request, Response } from "express"
import { IjwtService } from "../../../domain/interface/serviceInterface/IjwtService"
import { IadminLoginUseCase } from "../../../domain/interface/usecaseInterface/admin/Auth/adminLoginUsecase"
import { HttpStatus } from "../../../domain/entities/httpStatus"
import { setCookie } from "../../../framework/services/tokenCookieSet"

export class AdminLoginController {
    private adminLoginUseCase: IadminLoginUseCase
    private jwtService: IjwtService
    constructor(adminLoginUseCase: IadminLoginUseCase, jwtService: IjwtService) {
        this.adminLoginUseCase = adminLoginUseCase
        this.jwtService = jwtService
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
            const admin = await this.adminLoginUseCase.handleLogin(email, password)
            if (!admin) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: "invalid credentials" })
                return
            }
            if (admin.role != 'admin') {
                res.status(HttpStatus.BAD_REQUEST).json({ message: "this is not admin" })
                return
            }
            const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY as string
            const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY as string
            const accessToken = this.jwtService.createAccessToken(ACCESS_TOKEN_KEY, admin._id?.toString() || "", admin.role)
            const refreshToken = this.jwtService.createRefreshToken(REFRESH_TOKEN_KEY, admin._id?.toString() || "")
            setCookie(res, refreshToken)
            res.status(HttpStatus.OK).json({ message: 'login success', admin, accessToken })
        } catch (error) {
            console.log('error while admin login', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'error while login admin',
                error: error instanceof Error ? error.message : 'error while login admin'
            })
        }
    }
}