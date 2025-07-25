import { BookingData } from "../../../../entities/BookingEntities";

export interface IcreatePaymentIntentUsecase{

    createPaymentIntent(bookingData:BookingData): Promise<string>
}