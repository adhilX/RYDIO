import { Request, Response } from "express";
import { IBlockUserUseCase } from "../../../domain/interface/usecaseInterface/admin/IBlockUserUseCase";
import { HttpStatus } from "../../../domain/entities/httpStatus";

export class BlockUserController {
    private _userBlockUseCase: IBlockUserUseCase
    constructor(userBlockUseCase:IBlockUserUseCase ) {
        this._userBlockUseCase = userBlockUseCase
    }
    async handleClientBlock(req: Request, res: Response): Promise<void> {
        try {
             const {userId}= req.params
            await this._userBlockUseCase.blockUser({userId})
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