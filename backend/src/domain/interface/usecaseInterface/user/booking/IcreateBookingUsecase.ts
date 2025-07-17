import { Ibooking } from "../../../../entities/BookingEntities";

export interface IcreateBookingUsecase {
    createBooking(booking: Ibooking): Promise<Ibooking>
}