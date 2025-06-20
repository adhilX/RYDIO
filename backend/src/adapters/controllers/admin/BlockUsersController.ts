import { Request, Response } from "express";
import { IblockUserUseCase } from "../../../domain/interface/usecaseInterface/admin/IBlockUserUseCase";
import { HttpStatus } from "../../../domain/entities/httpStatus";

export class BlockUserController {
    private userBlockUseCase: IblockUserUseCase
    constructor(userBlockUseCase:IblockUserUseCase ) {
        this.userBlockUseCase = userBlockUseCase
    }
    async handleClientBlock(req: Request, res: Response): Promise<void> {
        try {
             const {userId}= req.params
            await this.userBlockUseCase.blockUser(userId)
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