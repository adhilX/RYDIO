import { Request, Response } from "express";
import { HttpStatus } from "../../../../domain/entities/httpStatus"
import { ICreateBookingUsecase } from "../../../../domain/interface/usecaseInterface/bookings/ICreateBookingUsecase";

export class CreateBookingController {
    private _createBookingUsecase: ICreateBookingUsecase
    constructor(createBookingUsecase: ICreateBookingUsecase) {
        this._createBookingUsecase = createBookingUsecase
    }

    async createBooking(req:Request,res:Response) {
      try {
        const {stripeIntentId, user_id, bookingData} = req.body

        const input = {
          bookingData,
          user_id,
          stripeIntentId
        };

        const response = await this._createBookingUsecase.createBooking(input)
        res.status(HttpStatus.OK).json(response)
      } catch (error) {
          console.log('error while creating booking ', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Error while creating booking',
                error: error instanceof Error ? error.message : 'Unknown error from create booking controller',
            })
      }
    }
}