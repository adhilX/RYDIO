import { Request, Response } from "express"
import { IgetBookingUsecase } from "../../../../domain/interface/usecaseInterface/admin/BookingMangment/IgetBookingUsecase"
import { HttpStatus } from "../../../../domain/entities/httpStatus"

export class GetBookingController {
    constructor(private _getBookingUsecase: IgetBookingUsecase) {
        this._getBookingUsecase = _getBookingUsecase
    }

    async getBookingData(req: Request, res: Response) {
        try {
            const { search, limit, page } = req.body
            const response = await this._getBookingUsecase.getBookingData(search, limit, page)
            res.status(HttpStatus.OK).json(response)

        } catch (error) {
           console.log('error while fetching booking', error)
           res.status(HttpStatus.BAD_REQUEST).json({
            message: "Error while fetching booking",
            error: error instanceof Error ? error.message : 'Unknown error from getBooking controller',
        })
        }
    }
}