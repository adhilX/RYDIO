import { BookingEntities } from "../../entities/BookingEntities";

export interface IbookingRepostory {
    createBooking(booking: BookingEntities): Promise<BookingEntities>
}