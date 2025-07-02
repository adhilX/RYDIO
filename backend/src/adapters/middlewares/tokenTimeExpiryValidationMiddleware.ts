import { NextFunction, Request, Response } from "express";
import { IjwtService } from "../../domain/interface/serviceInterface/IjwtService";
import { HttpStatus } from "../../domain/entities/httpStatus";

export const TokenTimeExpiryValidationMiddleware = (jwtService: IjwtService) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: 'No token provided' });
            return
        }
        const token = authHeader.split(' ')[1]
        try {
            const decoded = await jwtService.tokenDecode(token) as { exp?: number }
            if (!decoded || !decoded.exp) {
                res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Token expiration done' })
                return
            }
            const currentTime = Math.floor(Date.now() / 1000)
            const timeLeft = decoded.exp - currentTime
            if (timeLeft <= 0) {
                res.status(HttpStatus.UNAUTHORIZED).json({ error: "Token Expired" })
                return
            }
            next()
        } catch (error) {
            console.log('error while checking the Token expiry', error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "error while checking the token expiry" })
        }
    }
}
