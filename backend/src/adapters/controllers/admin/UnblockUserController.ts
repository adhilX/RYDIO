import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/entities/httpStatus";
import { IUnblockUserUsecase } from "../../../domain/interface/usecaseInterface/admin/IUnblockUserUsecase";

export class UnblockUserController {
    private _userUnblockUseCase: IUnblockUserUsecase
    constructor(userUnblockUseCase:IUnblockUserUsecase ) {
        this._userUnblockUseCase = userUnblockUseCase
    }
    async handleClientBlock(req: Request, res: Response): Promise<void> {
        try {
             const {userId}= req.params
            await this._userUnblockUseCase.unblockUser({userId} )
            res.status(HttpStatus.OK).json({ message: "Client Blocked" })
        } catch (error) {
            console.log('error while blocking user', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'error while blocking user',
                error: error instanceof Error ? error.message : 'error while blocking user'
            })
        }
    }
}