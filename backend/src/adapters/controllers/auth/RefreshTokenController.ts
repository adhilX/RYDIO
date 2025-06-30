import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/entities/httpStatus";
import { IrefreshTokenUseCase } from "../../../domain/interface/usecaseInterface/auth/IrefreshTokenUseCase";

export class RefreshTokenController {
    private refreshTokenUseCase: IrefreshTokenUseCase
    constructor(refreshTokenUseCase: IrefreshTokenUseCase) {
        this.refreshTokenUseCase = refreshTokenUseCase
    }
    async handleRefreshToken(req: Request, res: Response): Promise<void> {
        try {
            const refreshToken = req.cookies.refreshtoken
            if (!refreshToken) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: "No refreshToken found" })
                return
            }
            const newAccessToken = await this.refreshTokenUseCase.execute(refreshToken)
            res.status(HttpStatus.OK).json({message:'New Access Token Created',newAccessToken})
        } catch (error) {
            console.log('error while handling refresh Token', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: "error while handlling refresh Token",
                error: error instanceof Error ? error.message : 'error while handling refresh Token'
            })
        }
    }
}