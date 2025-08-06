import { Request, Response } from "express";
import { HttpStatus } from "../../../../domain/entities/httpStatus";
import { ImyBookingUsecase } from "../../../../domain/interface/usecaseInterface/user/booking/ImyBookingUsecase";

export class MyBookingController {

    constructor(private _myBookingUsecase:ImyBookingUsecase) {
        this._myBookingUsecase = _myBookingUsecase
    }

    async myBooking(req: Request, res: Response) {
        try {
            const {user_id,limit ,page,search,status} = req.body
            const response = await this._myBookingUsecase.execute(user_id,limit,page,search,status)
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