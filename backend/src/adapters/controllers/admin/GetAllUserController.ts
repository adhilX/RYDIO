import { Request, Response } from "express";
import { User } from "../../../domain/entities/userEntities";
import { IgetAllUserUsecase } from "../../../domain/interface/usecaseInterface/admin/getAllUserUsecase";
import { HttpStatus } from "../../../domain/entities/httpStatus";

export class GetAllUserController {

    private getAllUserUsecase: IgetAllUserUsecase

    constructor(getAllUserUsecase: IgetAllUserUsecase) {
        this.getAllUserUsecase = getAllUserUsecase
    }

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.getAllUserUsecase.getAllUser()
            res.status(HttpStatus.OK).json({ user, message: 'success' })

        } catch (error) {
            console.log('error while admin login', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'error while login admin',
                error: error instanceof Error ? error.message : 'error while login admin'
            })
        }
    }
}