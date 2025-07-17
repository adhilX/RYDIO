import { HttpStatus } from "../../../../domain/entities/httpStatus"
import { CreateBookingUsecase } from "../../../../useCases/user/booking/createBooking"

export class CreateBookingController {
    private createBookingUsecase: CreateBookingUsecase
    constructor(createBookingUsecase: CreateBookingUsecase) {
        this.createBookingUsecase = createBookingUsecase
    }

    async createBooking(req: any, res: any) {
      try {
        const {booking}  =req.body
        const response = await this.createBookingUsecase.createBooking(booking)
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