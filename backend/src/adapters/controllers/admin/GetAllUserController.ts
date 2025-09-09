import { Request, Response } from "express";
import { IGetAllUserUsecase } from "../../../domain/interface/usecaseInterface/admin/IGetAllUserUsecase";
import { HttpStatus } from "../../../domain/entities/httpStatus";

export class GetAllUserController {

    private _getAllUserUsecase: IGetAllUserUsecase

    constructor(getAllUserUsecase: IGetAllUserUsecase) {
        this._getAllUserUsecase = getAllUserUsecase
    }

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const user = await this._getAllUserUsecase.getAllUser()
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