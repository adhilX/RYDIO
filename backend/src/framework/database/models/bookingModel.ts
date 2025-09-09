import { Document, model, ObjectId } from "mongoose";
import { IBooking } from "../../../domain/entities/BookingEntities";
import { BookingSchema } from "../schema/bookingSchema";

export interface IBookingModel extends Omit<IBooking,'_id'>,Document{
_id:ObjectId
}

export const bookingModel = model<IBooking>('booking',BookingSchema)