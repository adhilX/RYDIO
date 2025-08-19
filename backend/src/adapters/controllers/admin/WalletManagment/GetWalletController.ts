import { HttpStatus } from "../../../../domain/entities/httpStatus";
import { IgetAdminWalletUsecase } from "../../../../domain/interface/usecaseInterface/admin/walletManagment/IgetAdminWalletUsecase";
import { Request, Response } from "express";

export class GetAdminWalletController {
    constructor(private getAdminWalletUsecase: IgetAdminWalletUsecase){}
    async getWalletDetails(req: Request, res: Response){
        try {
            // const {page, limit} = req.query
            // const pageNumber = parseInt(page as string) || 1
            // const limitNumber = parseInt(limit as string) || 10
            
            const walletDetails = await this.getAdminWalletUsecase.getWalletDetails()
            return res.status(HttpStatus.OK).json({message:'Wallet details fetched successfully',success:true,walletDetails})
        } catch (error) {
            console.log(error)
            return res.status(HttpStatus.BAD_REQUEST).json({message:'Internal server error'})
        }
    }
}
