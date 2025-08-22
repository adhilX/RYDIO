import { BookingData } from "../../domain/entities/BookingEntities";
import { IredisService } from "../../domain/interface/serviceInterface/IredisService";
import { IStripeService } from "../../domain/interface/serviceInterface/IstripeService";
import { IcreatePaymentIntentUsecase } from "../../domain/interface/usecaseInterface/user/booking/IcreatePaymentIntentUsecase";

export class CreatePaymentIntentUsecase implements IcreatePaymentIntentUsecase{
    constructor(private _stripeService: IStripeService,private _redisService: IredisService) {
        this._stripeService = _stripeService
        this._redisService = _redisService
    }
        async createPaymentIntent(bookingData:BookingData): Promise<string> {
  console.log('booking data from payment intent usecase ',bookingData)
      const redisKey = `hold:vehicle:${bookingData.vehicle_id},startDate:${bookingData.start_date},endDate:${bookingData.end_date}`;

    const isHeld = await this._redisService.get(redisKey);
     
if(isHeld && isHeld !== bookingData.user_id)throw new Error('this vehicle is currently held by another user.')
      await this._redisService.set(redisKey,  600,bookingData.user_id); 
      return  await this._stripeService.createPaymentIntent(bookingData.total_amount)
    }
}