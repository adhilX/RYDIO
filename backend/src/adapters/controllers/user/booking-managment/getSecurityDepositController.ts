import { HttpStatus } from "../../../../domain/entities/httpStatus";
import { Request, Response } from "express";
import { IgetSecurityDepositUsecase } from "../../../../domain/interface/usecaseInterface/bookings/IgetSecurityDepositUsecase";

export class GetSecurityDepositController {
    constructor(private _getSecurityDepositUsecase: IgetSecurityDepositUsecase){}
    

    async handleGetSecurityDeposit(req:Request,res:Response){
        try {
            const response = await this._getSecurityDepositUsecase.getSecurityDeposit()
            res.status(HttpStatus.OK).json(response)
        } catch (error) {
            console.log('error while fetching security deposit ', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Error while fetching security deposit',
                error: error instanceof Error ? error.message : 'Unknown error from security deposit controller',
            })
        }
    }
}
