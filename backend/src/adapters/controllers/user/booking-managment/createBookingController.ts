import { HttpStatus } from "../../../../domain/entities/httpStatus"
import { CreateBookingUsecase } from "../../../../useCases/booking/createBookingUsecase"

export class CreateBookingController {
    private _createBookingUsecase: CreateBookingUsecase
    constructor(createBookingUsecase: CreateBookingUsecase) {
        this._createBookingUsecase = createBookingUsecase
    }

    async createBooking(req: any, res: any) {
      try {
        const {stripeIntentId,user_id,bookingData}  =req.body

        const response = await this._createBookingUsecase.createBooking({bookingData,stripeIntentId,user_id})
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