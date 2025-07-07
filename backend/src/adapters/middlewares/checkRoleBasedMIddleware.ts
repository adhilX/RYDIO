import { NextFunction, Request, Response } from "express"
import { HttpStatus } from "../../domain/entities/httpStatus"

export const checkRoleBaseMiddleware = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user
        console.log(user)
        if (!user || !allowedRoles.includes(user.role)) {
            res.status(HttpStatus.FORBIDDEN).json({ error: "Access Denied:UnAuthorized role" })
            return
        }
        next()
    }
}