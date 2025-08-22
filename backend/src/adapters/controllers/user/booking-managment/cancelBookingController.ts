import { Request, Response } from "express";
import { IcancelBookingUseCase } from "../../../../domain/interface/usecaseInterface/bookings/IcancelBookingUseCase";
import { HttpStatus } from "../../../../domain/entities/httpStatus";
export class CancelBookingController {
    constructor(private cancelBookingUseCase: IcancelBookingUseCase){}

    async cancelBooking(req:Request,res:Response){
        try {
            const {reason} = req.body;
            const {bookingId}= req.params
            await this.cancelBookingUseCase.execute({ booking_id: bookingId, cancellation_reason: reason });
            res.status(HttpStatus.OK).json({message:"Booking Cancelled"})
        } catch (error) {
            console.log('error while canceling booking ', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Error while canceling booking',
                error: error instanceof Error ? error.message : 'Unknown error from cancel booking controller',
            })
        }
    }
}
