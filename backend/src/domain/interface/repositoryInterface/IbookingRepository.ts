import { Ibooking } from "../../entities/BookingEntities";

export interface IbookingRepostory {
    createBooking(booking: Ibooking): Promise<Ibooking>
    findByPaymentIntentId(payment_intent_id: string): Promise<Ibooking|null>
}