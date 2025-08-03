import { BookingData, Ibooking } from "../../../../entities/BookingEntities";

export interface IcreateBookingUsecase {
    createBooking({bookingData,user_id,stripeIntentId}: {bookingData:BookingData,user_id:string,stripeIntentId:string}): Promise<Ibooking>
}