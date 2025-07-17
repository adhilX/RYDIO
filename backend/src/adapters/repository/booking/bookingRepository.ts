import { Ibooking } from "../../../domain/entities/BookingEntities";
import { IbookingRepostory } from "../../../domain/interface/repositoryInterface/IbookingRepository";
import { bookingModel } from "../../../framework/database/models/bookingModel";

export class BookingRepository implements IbookingRepostory{
    async createBooking(booking: Ibooking): Promise<Ibooking> {
        const createdBooking = await bookingModel.create(booking);
        if(!createdBooking){
            throw new Error('Failed to create booking');
        }
        return createdBooking
    }
}