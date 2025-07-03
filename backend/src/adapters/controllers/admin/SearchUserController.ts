import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/entities/httpStatus";
import { IsearchUserUsecase } from "../../../domain/interface/usecaseInterface/admin/IsearchUserUsecase";

export class SearchUserController {
    private searchUserUsecase: IsearchUserUsecase

    constructor(searchUserUsecase: IsearchUserUsecase) {
        this.searchUserUsecase = searchUserUsecase
    }
    async searchUser(req: Request, res: Response): Promise<void> {
        try {
            const { search, page, limit } = req.query;
            const searchStr: string = String(search);
            const pageNum: number = parseInt(String(page))
            const limitNum:number = parseInt(String(limit))

            const users = await this.searchUserUsecase.searchUser(searchStr, pageNum, limitNum);
            res.status(HttpStatus.OK).json({users})

        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'An error occurred while searching for users.',
                error: error instanceof Error ? error.message : String(error)
            });
            console.error('SearchUserController.searchUser error:', error);
        }
    }

}