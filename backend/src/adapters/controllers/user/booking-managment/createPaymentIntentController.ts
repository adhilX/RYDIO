import { Request, Response } from "express";
import { IcreatePaymentIntentUsecase } from "../../../../domain/interface/usecaseInterface/user/booking/IcreatePaymentIntentUsecase";
import { HttpStatus } from "../../../../domain/entities/httpStatus";
import { BookingData } from "../../../../domain/entities/BookingEntities";

export class CreatePaymentIntentController {
    constructor(private createPaymentIntentUsecase: IcreatePaymentIntentUsecase) {
        this.createPaymentIntentUsecase = createPaymentIntentUsecase
    }
    async createPaymentIntent(req: Request, res: Response) {
        try {
           const bookingData= req.body.bookingDataBody 
            console.log(bookingData,'log from create payment intent controller')
            const paymentIntent = await this.createPaymentIntentUsecase.createPaymentIntent(bookingData)
            res.status(HttpStatus.OK).json({ sessionId: paymentIntent })

        } catch (error) {
            console.log('error while creating payment intent ', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Error while creating payment intent',
                error: error instanceof Error ? error.message : 'Unknown error from create payment intent controller',
            })
        }
    }
}