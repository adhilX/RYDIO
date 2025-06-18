import { Request, Response } from "express";
import { HttpStatus } from "../../../../domain/entities/httpStatus";
import { IchangePasswordUsecase } from "../../../../domain/interface/usecaseInterface/user/authentication/IchangePasswordUsecase";

export class ChangePasswordController {
    private changePasswordUsecase: IchangePasswordUsecase
    constructor(changePasswordUsecase: IchangePasswordUsecase) {
        this.changePasswordUsecase = changePasswordUsecase
    }
    async handleForgetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email, newPassword } = req.body
            const forgettingPassWord = await this.changePasswordUsecase.ChangePassword(email, newPassword)
            if (!forgettingPassWord) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: 'error while forget password user' })
                return
            }
            res.status(HttpStatus.OK).json({ message: "password changed" })
        } catch (error) {
            console.log('error while forget password', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'error while forget password client',
                error: error instanceof Error ? error.message : 'error while forget password client'
            })
        }
    }
}