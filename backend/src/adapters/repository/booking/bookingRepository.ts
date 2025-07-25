import { Ibooking } from "../../../domain/entities/BookingEntities";
import { IbookingRepostory } from "../../../domain/interface/repositoryInterface/IbookingRepository";
import { bookingModel } from "../../../framework/database/models/bookingModel";

export class BookingRepository implements IbookingRepostory{
    async createBooking(booking: Ibooking): Promise<Ibooking> {
     return  await bookingModel.create(booking);      
    }

    async findByPaymentIntentId(payment_intent_id: string): Promise<Ibooking|null> {
      return await bookingModel.findOne({payment_intent_id})
    }
}