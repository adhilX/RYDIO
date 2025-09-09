import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/entities/httpStatus";
import { ISearchUserUsecase } from "../../../domain/interface/usecaseInterface/admin/ISearchUserUsecase";

export class SearchUserController {
    private _searchUserUsecase: ISearchUserUsecase

    constructor(searchUserUsecase: ISearchUserUsecase) {
        this._searchUserUsecase = searchUserUsecase
    }
    async searchUser(req: Request, res: Response): Promise<void> {
        try {
            const { search, page, limit } = req.query;
            const searchStr: string = String(search);
            const pageNum: number = Number(String(page))
            const limitNum:number = Number(String(limit))

            const users = await this._searchUserUsecase.searchUser({search: searchStr, page: pageNum, limit: limitNum});
            // console.log('gggggggggggggggggggggggg',users)
            res.status(HttpStatus.OK).json(users)

        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'An error occurred while searching for users.',
                error: error instanceof Error ? error.message : String(error)
            });
            console.error('SearchUserController.searchUser error:', error);
        }
    }

}