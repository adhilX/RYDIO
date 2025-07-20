import { Ibooking } from "../../entities/BookingEntities";

export interface IbookingRepostory {
    createBooking(booking: Ibooking): Promise<Ibooking>
}