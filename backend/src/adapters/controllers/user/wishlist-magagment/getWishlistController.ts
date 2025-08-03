import { HttpStatus } from "../../../../domain/entities/httpStatus"
import { IGetWishlistUseCase } from "../../../../domain/interface/usecaseInterface/user/wishlist/IGetWishlistUseCase"
import { Request, Response } from "express"

export class GetWishlistController {
    constructor(private getWishlistUseCase:IGetWishlistUseCase){}

    async handleGetWishlist(req:Request,res:Response){
        try {
            const {user_id} = req.body
            const response = await this.getWishlistUseCase.getWishlistItem(user_id)
            res.status(HttpStatus.OK).json(response)
        } catch (error) {
            console.log('error while fetching my booking ', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Error while fetching my booking',
                error: error instanceof Error ? error.message : 'Unknown error from my booking controller',
            })
        }
    }
}