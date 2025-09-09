import { Request, Response } from "express";
import { HttpStatus } from "../../../../domain/entities/httpStatus";
import { IncomingBookingUsecase } from "../../../../useCases/bookings/incomingBookingUsecase";

export class IncomingBookingController {
    constructor(private _incomingBookingUsecase: IncomingBookingUsecase) {}

    async getBookingDetails(req:Request,res:Response){
        try {
            const {userId} = req.params
            const {limit,page,search,status} = req.body
            const result = await this._incomingBookingUsecase.execute({ owner_id: userId, page, limit,search,status})
            res.json(result)
        } catch (error) {
            console.log('error while fetching booking details',error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'error while fetching booking details',
                error: error instanceof Error ? error.message : 'error while fetching booking details'
            })
        }
    }
}